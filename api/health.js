export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const checks = {
    stripeSecret: Boolean(process.env.STRIPE_SECRET_KEY),
    stripeWebhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    stripePriceMap: Boolean(
      process.env.STRIPE_PRICE_TIER_MAP ||
      process.env.STRIPE_PRICE_FAN_PASS ||
      process.env.STRIPE_PRICE_CREATOR_BASIC ||
      process.env.STRIPE_PRICE_CREATOR_PRO ||
      process.env.STRIPE_PRICE_FOUNDER ||
      process.env.STRIPE_PRICE_FEATURED
    ),
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL),
    supabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY),
    supabaseServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };

  const ready = {
    providerOptional: true,
    billingWebhook: checks.stripeSecret && checks.stripeWebhook && checks.stripePriceMap,
    serverData: checks.supabaseUrl && checks.supabaseServiceRole,
  };

  return res.status(200).json({
    service: 'SophiaTV',
    status: Object.values(ready).every(Boolean) ? 'ready' : 'preview',
    timestamp: new Date().toISOString(),
    checks,
    ready,
  });
}
