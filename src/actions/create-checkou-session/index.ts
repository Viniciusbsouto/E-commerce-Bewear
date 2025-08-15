"use server";

import { db } from "@/db";
import {
  CreateCheckoutSessionSchema,
  createCheckoutSessionSchema,
} from "./schema";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { orderItemTable, orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createCheckoutSession = async (
  data: CreateCheckoutSessionSchema,
) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const { orderId } = createCheckoutSessionSchema.parse(data);

  const order = await db.query.orderTable.findFirst({
    where: eq(orderTable.id, orderId),
  });

  if (!order) {
    throw new Error("Order not found");
  }
  if (order.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const orderItems = await db.query.orderItemTable.findMany({
    where: eq(orderItemTable.orderId, orderId),
    with: {
      productVariant: {
        with: {
          product: true,
        },
      },
    },
  });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      orderId,
    },
    line_items: orderItems.map((orderItem) => {
      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: `${orderItem.productVariant.product.name} - ${orderItem.productVariant.name}`,
            description: orderItem.productVariant.product.description,
            images: [orderItem.productVariant.imageUrl],
          },
          // Em centavos
          unit_amount: orderItem.priceInCents,
        },
        quantity: orderItem.quantity,
      };
    }),
  });

  return checkoutSession;
};
