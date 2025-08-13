"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddressForm from "./address-form";
import { useUserAddresses } from "@/hooks/queries/use-user-addresses";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/queries/use-cart";

const Addresses = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const { data: addresses, isLoading, error } = useUserAddresses();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();
  const { data: cart } = useCart();

  useEffect(() => {
    if (cart?.shippingAddress?.id) {
      setSelectedAddress(cart.shippingAddress.id);
    }
  }, [cart]);

  const handleGoToPayment = async () => {
    if (!selectedAddress || selectedAddress === "add_new") {
      toast.error("Selecione um endereço para continuar");
      return;
    }

    try {
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: selectedAddress,
      });
      toast.success("Endereço vinculado ao carrinho com sucesso!");
    } catch {
      toast.error("Erro ao vincular endereço ao carrinho");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : error ? (
          <p className="text-destructive">Erro ao carregar endereços</p>
        ) : (
          <RadioGroup
            value={selectedAddress}
            onValueChange={setSelectedAddress}
          >
            {addresses?.map((address) => (
              <Card key={address.id} className="cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={address.id} id={address.id} />
                    <div className="flex-1">
                      <Label
                        htmlFor={address.id}
                        className="block cursor-pointer"
                      >
                        <div className="text-sm font-medium">
                          {address.recipientName}, {address.street},{" "}
                          {address.number}
                          {address.complement && `, ${address.complement}`}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {address.neighborhood}, {address.city} -{" "}
                          {address.state} - {address.zipCode}
                        </div>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="cursor-pointer">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="add_new" id="add_new" />
                  <Label
                    htmlFor="add_new"
                    className="block cursor-pointer text-sm font-medium"
                  >
                    Adicionar novo endereço
                  </Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        )}
        {selectedAddress === "add_new" && (
          <AddressForm
            onAddressCreated={(addressId: string) => {
              setSelectedAddress(addressId);
            }}
          />
        )}
        {selectedAddress && selectedAddress !== "add_new" && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleGoToPayment}
              disabled={updateCartShippingAddressMutation.isPending}
              className="w-full md:w-auto"
            >
              {updateCartShippingAddressMutation.isPending
                ? "Processando..."
                : "Ir para Pagamento"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
