"use client";
import React from "react";
import Link from "next/link";
import { History, ShoppingCart, Store } from "lucide-react";
import ProductStatsPieChart from "@/app/api/ProductStatsPieChart";

const Home = () => {
  return (
    <div className="p-4 ">
      {/* <h1 className="text-3xl font-bold text-center mb-6">หน้าแรก</h1> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/*Shop Card */}
        <Link
          href="/inventory/shop"
          className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border flex flex-col items-center justify-center gap-4 group"
        >
          <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-200 transition-colors">
            <Store size={48} className="text-blue-600" />
          </div>
          <span className="text-xl font-semibold text-gray-700">คลังพัสดุ</span>
        </Link>

        {/* Cart Card */}
        <Link
          href="/inventory/cart"
          className="bg-yellow-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border flex flex-col items-center justify-center gap-4 group"
        >
          <div className="bg-yellow-100 p-4 rounded-full group-hover:bg-yellow-200 transition-colors">
            <ShoppingCart size={48} className="text-yellow-600" />
          </div>
          <span className="text-xl font-semibold text-gray-700">ตะกร้าพัสดุ</span>
        </Link>

        {/* Shop History Card */}
        <Link
          href="/inventory/user/history"
          className="bg-red-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border flex flex-col items-center justify-center gap-4 group"
        >
          <div className="bg-red-100 p-4 rounded-full group-hover:bg-red-200 transition-colors">
            <History size={48} className="text-red-600" />
          </div>
          <span className="text-xl font-semibold text-gray-700">
            ประวัติการเบิก
          </span>
        </Link>


      </div>

      <ProductStatsPieChart />
    </div>
  );
};

export default Home;
