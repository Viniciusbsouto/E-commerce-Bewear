import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartShippingAddress } from "@/actions/update-cart-shipping-address";
import { getUseCartQueryKey } from "@/hooks/queries/use-cart";
import { getUseUserAddressesQueryKey } from "@/hooks/queries/use-user-addresses";
import type { UpdateCartShippingAddressInput } from "@/actions/update-cart-shipping-address/schema";

export const useUpdateCartShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCartShippingAddressInput) =>
      updateCartShippingAddress(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUseCartQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: getUseUserAddressesQueryKey(),
      });
    },
  });
};

export const getUpdateCartShippingAddressMutationKey = () => [
  "update-cart-shipping-address",
];
