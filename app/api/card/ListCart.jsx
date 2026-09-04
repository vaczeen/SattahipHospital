"use client";
import React from "react";
import { ListCheck } from "lucide-react";
import useEcomStore from "@/store/ecom-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserCart } from "@/lib/inventory-api/user";
import { toast } from "react-toastify";


const ListCart = () => {
  const cart = useEcomStore((state) => state.carts);
  const user = useEcomStore((state) => state.user);
  const token = useEcomStore((state) => state.token);
  const getTotalCount = useEcomStore((state) => state.getTotalCount);
  const router = useRouter ();

  const handleSaveCart = async () => {
    await createUserCart(token, { cart })
      .then((res) => {
        console.log(res);
        toast.success("ขอเบิกสำเร็จ", { position: "top-center" });
        router.push("/inventory/checkout");
      })
      .catch((err) => {
        console.log("err", err);
        toast.warning(err.response.data.message);
      });
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-start justify-center px-4 pt-4 pb-10">
      <div className="w-full max-w-7xl  p-6 rounded-2xl shadow-2xl border border-gray-700  bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
            <ListCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            รายการพัสดุ {cart.length} รายการ
          </h1>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left - Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-lg hover:bg-white/15 transition-colors"
              >
                <div className="flex justify-between items-start sm:items-center gap-3">
                  {/* Left - Image + Info */}
                  <div className="flex gap-3 sm:gap-4 items-center flex-1 min-w-0">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].url}
                        alt={item.title}
                        className="rounded-xl w-16 h-14 sm:w-24 sm:h-20 object-cover hover:scale-105 transition-transform duration-200 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-14 sm:w-20 sm:h-20 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm sm:text-base truncate">{item.title}</p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>
                    </div>
                  </div>

                  {/* Right - Count */}
                  <div className="bg-blue-500/20 text-blue-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-sm sm:text-lg whitespace-nowrap shrink-0">
                    {item.count} ชิ้น
                  </div>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="text-center py-16">
                <ListCheck className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 text-lg">ยังไม่มีพัสดุในตะกร้า</p>
              </div>
            )}
          </div>

          {/* Right - Summary */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-lg h-fit lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-white mb-4">
              พัสดุที่ต้องการเบิกทั้งหมด
            </h2>

            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-400">จำนวน:</span>
              <span className="text-2xl font-bold text-white">{getTotalCount()} ชิ้น</span>
            </div>

            <div className="flex flex-col gap-3 mt-5">
              {user ? (
                <button
                  onClick={(e) => {
                    if (cart.length < 1) {
                      e.preventDefault();
                      toast.warning("กรุณาเลือกพัสดุใส่ตะกร้าก่อน");
                    } else {
                      handleSaveCart();
                    }
                  }}
                  className="bg-green-600 w-full rounded-xl text-white py-2.5 font-medium hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                >
                  ดำเนินการต่อ
                </button>
              ) : (
                <Link href="/inventory/login">
                  <button className="bg-blue-600 w-full rounded-xl text-white py-2.5 font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                    Login
                  </button>
                </Link>
              )}

              <Link href="/inventory/shop">
                <button className="bg-white/10 w-full rounded-xl text-white py-2.5 font-medium hover:bg-white/20 transition-colors border border-white/10">
                  แก้ไขรายการ
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCart;

