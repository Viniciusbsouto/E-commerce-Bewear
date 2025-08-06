"use client";

import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

const QuantitySelector = () => {
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  return (
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
  );
};

export default QuantitySelector;
