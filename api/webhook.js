// SophiaTV Stripe Webhook Handler
// Handles subscription lifecycle events from Stripe
// Requires: STRIPE_WEBHOOK_SECRET env var in Vercel

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

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
    switch (event.type) {
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const planId = subscription.items.data[0]?.price?.id;
        console.log(`Subscription created: customer=${customerId}, plan=${planId}`);
        // TODO: Look up user by Stripe customer ID in Supabase and set their tier
        // await supabase.from('users').update({ tier: getTierFromPlan(planId), stripe_subscription_id: subscription.id })
        //   .eq('stripe_customer_id', customerId);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const planId = subscription.items.data[0]?.price?.id;
        const status = subscription.status;
        console.log(`Subscription updated: customer=${customerId}, plan=${planId}, status=${status}`);
        // TODO: Update user tier in Supabase
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        console.log(`Subscription cancelled: customer=${customerId}`);
        // TODO: Revoke access — set user tier back to 'free' in Supabase
        // await supabase.from('users').update({ tier: 'free', stripe_subscription_id: null })
        //   .eq('stripe_customer_id', customerId);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const customerEmail = invoice.customer_email;
        console.log(`Payment failed: customer=${customerId}, email=${customerEmail}`);
        // TODO: Send reminder email via your email provider (Resend, SendGrid, etc.)
        // await sendPaymentFailedEmail(customerEmail);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log(`Payment succeeded: customer=${invoice.customer}`);
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log(`Checkout completed: customer=${session.customer}, email=${session.customer_email}`);
        // TODO: Create or link user account in Supabase
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true, type: event.type });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return res.status(500).json({ error: 'Internal server error processing webhook' });
  }
}
