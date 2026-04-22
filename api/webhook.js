import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    await stripe.subscriptionSchedules.create({
      from_subscription: session.subscription,
      phases: [
        {
          items: [{ price: 'price_PAYANT' }],
          iterations: 2,
        },
        {
          items: [{ price: 'price_GRATUIT' }],
          iterations: 1,
        },
        {
          items: [{ price: 'price_PAYANT' }],
        },
      ],
      end_behavior: 'release',
    });
  }

  res.status(200).json({ received: true });
}
