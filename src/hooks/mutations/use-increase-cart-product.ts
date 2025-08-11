import { addProductToCart } from "@/actions/add-cart-product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUseCartQueryKey } from "../queries/use-cart";

export const getUseIncreaseCartProductQuantityMutationKey = (
  productVariantId: string,
) => ["increase-cart-product-quantity", productVariantId];

export const useIncreaseCartProductQuantity = (productVariantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUseIncreaseCartProductQuantityMutationKey(productVariantId),
    mutationFn: () => addProductToCart({ productVariantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
