// cart-item-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

const CartItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-[78px] w-[78px] rounded-md" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
};

export default CartItemSkeleton;
