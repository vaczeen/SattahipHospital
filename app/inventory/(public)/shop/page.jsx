"use client";
import React, { useEffect } from "react";
import ProductCard from "@/app/api/card/ProductCard";
import useEcomStore from "@/store/ecom-store";
import SearchCard from "@/app/api/card/SearchCard";
import CartCard from "@/app/api/card/CartCard";

const Shop = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="flex ">
      {/* search */}
      <div className="w-1/4 bg-gray-100 rounded-lg border p-4 h-screen">
        <SearchCard />
      </div>

      {/* product */}
      <div className="w-1/2 bg-white rounded-lg border p-4 h-screen overflow-y-auto">
        <p className="text-2xl font-bold mb-4">
          พัสดุทั้งหมด
          <br />
          <br />
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          {products.map((item, index) => (
            <ProductCard key={index} item={item} />
          ))}
        </div>
      </div>

      {/* cart */}
      <div className="w-1/4 bg-gray-100 border rounded-lg p-4 h-screen overflow-y-auto">
        <CartCard />
      </div>
    </div>
  );
};

export default Shop;
