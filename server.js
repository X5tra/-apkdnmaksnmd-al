import express from 'express';
import Stripe from 'stripe';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

 const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: [item.image],
                    },
                    unit_amount: Math.round(item.price * 100), // Convert to cents
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${req.headers.origin}/?success=true`,
            cancel_url: `${req.headers.origin}/?canceled=true`,
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'AU'], // Add countries you ship to
            },
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));