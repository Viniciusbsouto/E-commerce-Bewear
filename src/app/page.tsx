import React from "react";
import Header from "../components/ui/common/header";
import Image from "next/image";
import { db } from "@/db";
import ProductList from "@/components/ui/common/product-list";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });
  console.log(products);
  return (
    <>
      <Header />
      <div className="space-y-6">
        <div className="px-5">
          <Image
            src="/banner-01.png"
            alt="Leve uma vida com estilo"
            width={0}
            height={0}
            sizes="100vh"
            className="h-auto w-full"
          />
        </div>
        <ProductList title="Produtos em destaque" products={products} />
        <div className="px-5">
          <Image
            src="/banner-02.png"
            alt="Leve uma vida com estilo"
            width={0}
            height={0}
            sizes="100vh"
            className="h-auto w-full"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
