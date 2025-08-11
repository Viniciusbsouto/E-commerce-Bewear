import { decreaseCartProductQuantity } from "@/actions/decrease-cart-product-quantity";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUseCartQueryKey } from "../queries/use-cart";

export const getUseDecreaseCartProductQuantityMutationKey = (
  cartItemId: string,
) => [
  "decrease-cart-product-quantity",
  cartItemId,
];

export const useDecreaseCartProductQuantity = (cartItemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUseDecreaseCartProductQuantityMutationKey(cartItemId),
    mutationFn: () => decreaseCartProductQuantity({ cartItemId: cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};