'use server';

import { MOCK_EVENTS } from '@/components/landing/FeaturedEvents';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

type CreateCheckoutSessionParams = {
    priceId: string, // We'll assume a convention for price IDs
    eventName: string,
    eventDescription: string,
    eventImageUrl: string,
    eventId: string,
    userId: string,
}

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
    const { priceId, eventName, eventDescription, eventImageUrl, eventId, userId } = params;

    const event = MOCK_EVENTS.find(e => e.id === eventId);
    if (!event || event.price === 0) {
        throw new Error('Event not found or is free.');
    }

    // In a real app, you would retrieve or create a Stripe Price ID.
    // For this prototype, we'll create a product and price on the fly.
    // This is NOT recommended for production due to duplicate products.
    try {
        const product = await stripe.products.create({
            name: eventName,
            description: eventDescription,
            images: [eventImageUrl],
        });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: event.price * 100, // Price in cents
            currency: 'usd',
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&eventId=${eventId}&userId=${userId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}`,
            metadata: {
                eventId: eventId,
                userId: userId,
            }
        });

        return { sessionId: session.id };
    } catch (error: any) {
        console.error('Stripe Error:', error.message);
        throw new Error('Failed to create Stripe checkout session.');
    }
}
