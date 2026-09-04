"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/app/api/card/ProductCard";
import useEcomStore from "@/store/ecom-store";
import SearchCard from "@/app/api/card/SearchCard";
import CartCard from "@/app/api/card/CartCard";
import { Package, Search, ShoppingCart, X } from "lucide-react";

const Shop = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
  const carts = useEcomStore((state) => state.carts);
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Floating Buttons */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 flex gap-3 z-40">
        <button
          onClick={() => { setShowSearch(!showSearch); setShowCart(false); }}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-xl shadow-lg border border-gray-600 hover:bg-gray-700 transition-colors"
        >
          <Search className="w-5 h-5" />
          ค้นหา
        </button>
        <button
          onClick={() => { setShowCart(!showCart); setShowSearch(false); }}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-xl shadow-lg border border-gray-600 hover:bg-gray-700 transition-colors relative"
        >
          <ShoppingCart className="w-5 h-5" />
          ตะกร้า
          {carts.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {carts.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowSearch(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <button onClick={() => setShowSearch(false)} className="absolute top-2 right-2 z-10 p-2 bg-gray-800 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
              <SearchCard />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Cart Overlay */}
      {showCart && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowCart(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <button onClick={() => setShowCart(false)} className="absolute top-2 right-2 z-10 p-2 bg-gray-800 rounded-full text-white">
                <X className="w-5 h-5" />
              </button>
              <CartCard />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Search Sidebar */}
      <div className="hidden md:block w-1/4 p-4 h-screen overflow-y-auto sticky top-0">
        <SearchCard />
      </div>

      {/* Product Grid */}
      <div className="w-full md:w-2/4 lg:w-[55%] min-h-screen md:h-screen overflow-y-auto hide-scrollbar bg-gradient-to-b from-gray-900 to-gray-800 p-4 sm:p-6 rounded-none md:rounded-2xl md:shadow-2xl md:border border-gray-700 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              พัสดุทั้งหมด
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {products.length} รายการ
            </p>
          </div>
        </div>

        {/* Product Cards */}
        {products.length > 0 ? (
          <div className="flex justify-center flex-wrap gap-3 sm:gap-4">
            {products.map((item, index) => (
              <ProductCard key={index} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            ไม่พบสินค้า
          </div>
        )}
      </div>

      {/* Desktop Cart Sidebar */}
      <div className="hidden md:block w-1/4 lg:w-[22%] p-4 h-screen overflow-y-auto sticky top-0">
        <CartCard />
      </div>
    </div>
  );
};

export default Shop;
