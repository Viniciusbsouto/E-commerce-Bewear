"use server";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import {
  updateCartShippingAddressSchema,
  type UpdateCartShippingAddressInput,
} from "./schema";

export const updateCartShippingAddress = async (
  input: UpdateCartShippingAddressInput,
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const validatedInput = updateCartShippingAddressSchema.parse(input);

  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
  });

  if (!cart) {
    throw new Error("Carrinho não encontrado");
  }

  const [updatedCart] = await db
    .update(cartTable)
    .set({
      shippingAddressId: validatedInput.shippingAddressId,
    })
    .where(eq(cartTable.id, cart.id))
    .returning();

  return updatedCart;
};
