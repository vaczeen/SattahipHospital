"use client";
import React from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import useEcomStore from "@/store/ecom-store";
import Link from "next/link";
import { showToast } from "nextjs-toast-notify";

const CartCard = () => {
  //js
  const carts = useEcomStore((state) => state.carts);
  const actionUpdateQuantity = useEcomStore(
    (state) => state.actionUpdateQuantity
  );
  const actionRemoveProduct = useEcomStore(
    (state) => state.actionRemoveProduct
  );
  const getTotalCount = useEcomStore((state) => state.getTotalCount);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border">

      <h1 className="text-2xl font-bold">ตะกร้าพัสดุ</h1>
      {/* border */}
      <div className=" p-2 ">
        {/* card */}
        {carts.map((item, index) => (
          <div key={index} className="bg-white p-2  border rounded-md shadow-md mb-2">
            {/* row1 */}
            <div className="flex justify-between mb-2">
              {/* left */}
              <div className="flex gap-2 items-center">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0].url}
                    className="rounded-md w-30 h-24 object-cover hover:scale-110 hover:duration-200"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex text-center items-center">
                    No Image
                  </div>
                )}
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm">{item.description}</p>
                </div>
              </div>

              {/* delete */}
              <a
                href="#"
                onClick={() => actionRemoveProduct(item.id)}
                className="text-red-500 p-2 "
              >
                <Trash2 />
              </a>
            </div>

            {/* row2 */}
            <div className="flex justify-between">
              {/* left */}
              <div className="border rounded-sm px-2 py-1 flex items-center">
                <button
                  onClick={() => actionUpdateQuantity(item.id, item.count - 1)}
                  className="px-2 py-1 bg-gray-200 rounded-sm hover:bg-gray-400"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4">{item.count}</span>
                <button
                  onClick={() => actionUpdateQuantity(item.id, item.count + 1)}
                  className="px-2 py-1 bg-gray-200 rounded-sm  hover:bg-gray-400"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* right */}
              {/* <div className="font-bold text-blue-400">
                    price:10
                </div> */}
            </div>
          </div>
        ))}

        {/* total */}
        <div className="flex justify-between px-2 text-xl font-bold">
          <div>รวม</div>
          <div>{getTotalCount()} ชิ้น</div>
        </div>

        {/* button */}
        <Link
          href="/inventory/cart"
          onClick={(e) => {
            if (carts.length < 1) {
              e.preventDefault();
              showToast.warning("กรุณาเลือกพัสดุใส่ตะกร้าก่อน");
            }
          }}
        >
          <button className="mt-4 bg-green-500 hover:bg-green-800 text-white w-full py-2 rounded-md shadow-md">
            ดำเนินการต่อ
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CartCard;

