"use client";

import { Button } from "@/components/ui/button";
import AddToCartButton from "./add-to-cart-button";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addProductToCart } from "@/actions/add-cart-product";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
  productVariantId: string;
}

const ProductActions = ({ productVariantId }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };
  return (
    <>
      <div className="px-5">
        <div className="space-y-4">
          <h3 className="font-medium">Quantidade</h3>
          <div className="flex w-[100px] items-center justify-between rounded-lg border">
            <Button variant="ghost" size="icon" onClick={handleDecrement}>
              <MinusIcon className="h-4 w-4" />
            </Button>
            <p className="text-sm">{quantity}</p>
            <Button variant="ghost" size="icon" onClick={handleIncrement}>
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4 px-5">
        <AddToCartButton
          productVariantId={productVariantId}
          quantity={quantity}
        />
        <ComprarAgoraButton
          productVariantId={productVariantId}
          quantity={quantity}
        />
      </div>
    </>
  );
};

const ComprarAgoraButton = ({
  productVariantId,
  quantity,
}: {
  productVariantId: string;
  quantity: number;
}) => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      router.push("/cart/identification");
    },
  });

  return (
    <Button
      className="rounded-full"
      size="lg"
      variant="default"
      disabled={isPending}
      onClick={() => mutate()}
    >
      Comprar agora
    </Button>
  );
};

export default ProductActions;
