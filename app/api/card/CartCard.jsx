"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import useEcomStore from "@/store/ecom-store";
import Link from "next/link";
import { showToast } from "nextjs-toast-notify";

// ช่องกรอกจำนวนสินค้า พิมพ์เลขได้โดยตรง และ commit เมื่อ blur หรือกด Enter
const QuantityInput = ({ item, actionUpdateQuantity }) => {
  const [value, setValue] = useState(String(item.count));

  // ซิงค์ค่ากับ store เมื่อกด + หรือ -
  useEffect(() => {
    setValue(String(item.count));
  }, [item.count]);

  const handleChange = (e) => {
    const input = e.target.value;
    // รับเฉพาะตัวเลขหรือช่องว่าง (ให้ลบแล้วพิมพ์ใหม่ได้)
    if (input === "" || /^\d+$/.test(input)) {
      setValue(input);
    }
  };

  const handleCommit = () => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) {
      // ค่าที่พิมพ์ไม่ถูกต้อง ให้กลับไปเป็นค่าเดิม
      setValue(String(item.count));
      return;
    }
    if (num > item.quantity) {
      // จำนวนที่พิมพ์เกินจำนวนในคลัง
      setValue(String(item.count));
      showToast.warning(`จำนวนเกินคงคลัง (มีในคลัง ${item.quantity} ชิ้น)`);
      return;
    }
    actionUpdateQuantity(item.id, num);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      onBlur={handleCommit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      className="w-12 text-center px-2 py-1 bg-gray-900 border border-gray-600 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-white/40"
    />
  );
};

const CartCard = () => {
  //js
  const carts = useEcomStore((state) => state.carts);
  const actionUpdateQuantity = useEcomStore(
    (state) => state.actionUpdateQuantity,
  );
  const actionRemoveProduct = useEcomStore(
    (state) => state.actionRemoveProduct,
  );
  const getTotalCount = useEcomStore((state) => state.getTotalCount);

  // ป้องกัน Hydration mismatch: carts มาจาก localStorage ซึ่งฝั่ง server ไม่มี
  // ช่วง SSR/ไฮเดรตให้ render เหมือน server (ตะกร้าว่าง) แล้วค่อยแสดงข้อมูลจริงหลัง mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayCarts = mounted ? carts : [];
  const displayTotal = mounted ? getTotalCount() : 0;

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          ตะกร้าพัสดุ
        </h1>
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        {displayCarts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            ยังไม่มีสินค้าในตะกร้า
          </div>
        ) : (
          displayCarts.map((item, index) => (
            <div
              key={index}
              className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-3 hover:border-gray-500 transition-colors"
            >
              {/* Row 1: Image + Info + Delete */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3 items-center">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0].url}
                      className="rounded-lg w-14 h-14 sm:w-20 sm:h-20 object-cover border border-gray-700 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 text-xs border border-gray-700 shrink-0">
                      No Image
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white text-sm truncate">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => actionRemoveProduct(item.id)}
                  className="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Row 2: Quantity Controls */}
              <div className="flex items-center gap-1 bg-gray-800 rounded-lg w-fit">
                <button
                  onClick={() => actionUpdateQuantity(item.id, item.count - 1)}
                  className="px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minus size={14} className="text-red-400"/>
                </button>
                <QuantityInput
                  item={item}
                  actionUpdateQuantity={actionUpdateQuantity}
                />
                <button
                  onClick={() => {
                    if (item.count + 1 > item.quantity) {
                      showToast.warning(
                        `จำนวนเกินคงคลัง (มีในคลัง ${item.quantity} ชิ้น)`,
                      );
                      return;
                    }
                    actionUpdateQuantity(item.id, item.count + 1);
                  }}
                  className="px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Plus size={14} className="text-green-700"/>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      {displayCarts.length > 0 && (
        <>
          <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-700">
            <span className="text-sm font-semibold text-gray-400">รวม</span>
            <span className="text-xl font-bold text-white">
              {displayTotal} ชิ้น
            </span>
          </div>

          {/* Checkout Button */}
          <Link
            href="/inventory/cart"
            onClick={(e) => {
              if (carts.length < 1) {
                e.preventDefault();
                showToast.warning("กรุณาเลือกพัสดุใส่ตะกร้าก่อน");
              }
            }}
          >
            <button className="mt-4 w-full py-3 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-200 transition-all shadow-lg shadow-white/10">
              ดำเนินการต่อ
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default CartCard;
