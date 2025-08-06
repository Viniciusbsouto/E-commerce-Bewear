import React from "react";
import Header from "../components/ui/common/header";
import Image from "next/image";
import { db } from "@/db";
import ProductList from "@/components/ui/common/product-list";
import CategorySelector from "@/components/ui/common/category-selector";
import { productTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import Footer from "@/components/ui/common/footer";
import PartnerBrands from "@/components/ui/common/partner-list";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  const categories = await db.query.categoryTable.findMany({});
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

        <PartnerBrands title="Marcas parceiras" />

        <ProductList title="Produtos em destaque" products={products} />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

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

        <ProductList title="Novos produtos" products={newlyCreatedProducts} />

        <Footer />
      </div>
    </>
  );
};

export default Home;
