import Header from "@/components/ui/common/header";
import { db } from "@/db";
import { auth } from "@/lib/auth";
// eq from drizzle-orm not required here (using inline arrow where provides eq)
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Addresses from "./components/addresses";
import CartSumary from "./components/cart-sumary";
import Footer from "@/components/ui/common/footer";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/login");
  }
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });
  if (!cart || cart.items.length === 0) {
    redirect("/");
  }
  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
  return (
    <div>
      <Header />
      <div className="space-y-4 px-5">
        <Addresses />
        <CartSumary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.id,
            name: item.productVariant.product.name,
            quantity: item.quantity,
            variantName: item.productVariant.name,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default IdentificationPage;
