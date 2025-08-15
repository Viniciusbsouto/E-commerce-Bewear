"use server";

import { db } from "@/db";
import {
  cartTable,
  orderItemTable,
  orderTable,
  shippingAddressTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const finishOrder = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: true,
        },
      },
    },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  if (!cart.shippingAddressId) {
    throw new Error("Shipping address not found");
  }

  const totalPriceInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );

  await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orderTable)
      .values({
        userId: session.user.id,
        shippingAddressId: cart.shippingAddressId!,
        recipientName: cart.shippingAddress!.recipientName,
        street: cart.shippingAddress!.street,
        number: cart.shippingAddress!.number,
        complement: cart.shippingAddress!.complement,
        city: cart.shippingAddress!.city,
        state: cart.shippingAddress!.state,
        neighborhood: cart.shippingAddress!.neighborhood,
        zipCode: cart.shippingAddress!.zipCode,
        country: cart.shippingAddress!.country,
        phone: cart.shippingAddress!.phone,
        email: cart.shippingAddress!.email,
        cpfOrCnpj: cart.shippingAddress!.cpfOrCnpj,
        totalPriceInCents,
      })
      .returning();

    if (!order) {
      throw new Error("Order not found");
    }

    const orderItemsPayload: Array<typeof orderItemTable.$inferInsert> =
      cart.items.map((item) => ({
        orderId: order.id,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        priceInCents: item.productVariant.priceInCents,
      }));
    await tx.insert(orderItemTable).values(orderItemsPayload);
    await tx.delete(cartTable).where(eq(cartTable.userId, session.user.id));
  });
};
