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
    <div className="bg-gray-100 rounded-sm p-4">
      {/* header */}
      <div className="flex gap-4">
        <ListCheck size={36} />
        <p className="text-2xl font-bold">รายการพัสดุ {cart.length} รายการ</p>
      </div>

      {/* list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
        {/* left */}
        <div className="col-span-2">
          {/* card */}
          {cart.map((item, index) => (
            <div key={index} className="bg-white p-2 rounded-md shadow-md mb-2">
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
                <div>
                  <div className="font-bold text-blue-500 text-xl my-8 ">
                    {item.count} ชิ้น
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* right */}
        <div className="bg-white p-4 rounded-md shadow-md space-y-4">
          <p className=" text-2xl font-bold">พัสดุที่ต้องการเบิกทั้งหมด</p>
          <div className="flex justify-between">
            <span className="text-2xl">จำนวน:</span>
            <span className="text-2xl">{getTotalCount()} ชิ้น</span>
          </div>

          <div className="flex flex-col gap-2">
            {user ? (
              
                <button

                  onClick={(e) => {
                    if (cart.length < 1) {
                      e.preventDefault();
                      toast.warning("กรุณาเลือกพัสดุใส่ตะกร้าก่อน");
                    } else {
                      handleSaveCart()
                    }

                  }}
                  className="bg-green-600 w-full rounded-md text-white py-2 shaddow-md hover:bg-green-700"
                >
                  ดำเนินการต่อ
                </button>
             
            ) : (
              <Link href={"/inventory/login"}>
                <button className="bg-blue-500 w-full rounded-md text-white py-2 shaddow-md hover:bg-blue-700">
                  Login
                </button>
              </Link>
            )}

            <Link href={"/inventory/shop"}>
              <button className="bg-gray-700 w-full rounded-md text-white py-2 shaddow-md hover:bg-gray-900">
                แก้ไขรายการ
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCart;

