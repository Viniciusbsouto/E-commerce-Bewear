import { createShippingAddress } from "@/actions/create-shipping-address";
import { CreateShippingAddressSchema } from "@/actions/create-shipping-address/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUseUserAddressesQueryKey } from "../queries/use-user-addresses";

export const getUseCreateShippingAddressMutationKey = () => [
  "create-shipping-address",
];

export const useCreateShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUseCreateShippingAddressMutationKey(),
    mutationFn: (data: CreateShippingAddressSchema) =>
      createShippingAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUseUserAddressesQueryKey(),
      });
    },
  });
};
