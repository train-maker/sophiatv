// SophiaTV Stripe Webhook Handler
// Handles subscription lifecycle events from Stripe
// Requires: STRIPE_WEBHOOK_SECRET env var in Vercel

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});
const PROFILE_TABLE = process.env.SUPABASE_PROFILE_TABLE || 'profiles';
const ACTIVE_SUBSCRIPTION_STATUSES = new Set(['active', 'trialing']);

export const config = {
  api: {
    bodyParser: false, // Raw body required for Stripe signature verification
  },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function getTierFromPrice(priceId) {
  if (!priceId) return null;

  const defaultMap = {
    [process.env.STRIPE_PRICE_FAN_PASS]: 'fan',
    [process.env.STRIPE_PRICE_CREATOR_BASIC]: 'creator_basic',
    [process.env.STRIPE_PRICE_CREATOR_PRO]: 'creator_pro',
    [process.env.STRIPE_PRICE_FOUNDER]: 'founder',
    [process.env.STRIPE_PRICE_FEATURED]: 'featured',
  };

  if (process.env.STRIPE_PRICE_TIER_MAP) {
    try {
      return JSON.parse(process.env.STRIPE_PRICE_TIER_MAP)[priceId] || defaultMap[priceId] || null;
    } catch (err) {
      console.warn('Invalid STRIPE_PRICE_TIER_MAP JSON:', err.message);
    }
  }

  return defaultMap[priceId] || null;
}

async function updateProfile(filter, payload) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRole) {
    console.warn('Supabase service credentials are not configured; skipped profile update.');
    return { skipped: true };
  }

  const url = new URL(`/rest/v1/${PROFILE_TABLE}`, supabaseUrl);
  for (const [key, value] of Object.entries(filter)) {
    if (value) url.searchParams.set(key, `eq.${value}`);
  }

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      ...payload,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase profile update failed: ${response.status} ${message}`);
  }

  return { updated: true };
}

async function updateSubscriptionProfile(subscription, tierOverride) {
  const customerId = subscription.customer;
  const priceId = subscription.items.data[0]?.price?.id;
  const tier = tierOverride || getTierFromPrice(priceId);
  const active = ACTIVE_SUBSCRIPTION_STATUSES.has(subscription.status);

  const payload = {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    subscription_status: subscription.status,
  };

  if (tier && active) payload.tier = tier;
  if (!active && subscription.status !== 'canceled') payload.payment_attention_required = true;

  return updateProfile({ stripe_customer_id: customerId }, payload);
}

async function linkCheckoutSession(session) {
  const payload = {
    stripe_customer_id: session.customer,
    subscription_status: session.payment_status || 'checkout_completed',
  };

  if (session.subscription) payload.stripe_subscription_id = session.subscription;
  if (session.metadata?.tier) payload.tier = session.metadata.tier;

  if (session.client_reference_id) {
    return updateProfile({ id: session.client_reference_id }, payload);
  }

  if (session.customer_email) {
    return updateProfile({ email: session.customer_email }, payload);
  }

  console.warn('Checkout session has no client_reference_id or customer_email to link.');
  return { skipped: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;
  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  console.log(`Processing Stripe event: ${event.type}`);

  try {
    let result = { processed: true };

    switch (event.type) {
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const planId = subscription.items.data[0]?.price?.id;
        console.log(`Subscription created: customer=${customerId}, plan=${planId}`);
        result = await updateSubscriptionProfile(subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const planId = subscription.items.data[0]?.price?.id;
        const status = subscription.status;
        console.log(`Subscription updated: customer=${customerId}, plan=${planId}, status=${status}`);
        result = await updateSubscriptionProfile(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        console.log(`Subscription cancelled: customer=${customerId}`);
        result = await updateProfile({ stripe_customer_id: customerId }, {
          tier: 'free',
          stripe_subscription_id: null,
          subscription_status: 'canceled',
          payment_attention_required: false,
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const customerEmail = invoice.customer_email;
        console.log(`Payment failed: customer=${customerId}, email=${customerEmail}`);
        result = customerId
          ? await updateProfile({ stripe_customer_id: customerId }, {
              subscription_status: 'past_due',
              payment_attention_required: true,
            })
          : { skipped: true };
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log(`Payment succeeded: customer=${invoice.customer}`);
        result = invoice.customer
          ? await updateProfile({ stripe_customer_id: invoice.customer }, {
              payment_attention_required: false,
            })
          : { skipped: true };
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(`Checkout completed: customer=${session.customer}, email=${session.customer_email}`);
        result = await linkCheckoutSession(session);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true, type: event.type, result });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return res.status(500).json({ error: 'Internal server error processing webhook' });
  }
}
