import { z } from "zod";

export const updateCartShippingAddressSchema = z.object({
  shippingAddressId: z.string().uuid("ID do endereço é obrigatório"),
});

export type UpdateCartShippingAddressInput = z.infer<
  typeof updateCartShippingAddressSchema
>;
