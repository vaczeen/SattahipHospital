"use client";
import React, { useState, useEffect } from "react";
import { getOrders } from "@/lib/inventory-api/user";
import useEcomStore from "@/store/ecom-store";
import { Printer } from "lucide-react";
import PrintOrder from "@/app/api/card/PrintOrder";
import { dateFormat } from "@/lib/inventory-utils/dateformat";

const HistoryCard = () => {
  const [orders, setOrders] = useState([]);
  const token = useEcomStore((state) => state.token);
  const [printOrder, setPrintOrder] = useState(null);

  useEffect(() => {
    handleGetOrders(token);
  }, []);

  const handleGetOrders = (token) => {
    getOrders(token)
      .then((res) => {
        const sortedOrders = res.data.orders.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setOrders(sortedOrders);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePrint = (order) => {
    setPrintOrder(order);
    setTimeout(() => {
      document.fonts.load("16pt THSarabun").then(() => {
        window.print();
      });
    }, 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-200 text-gray-500 font-medium";
      case "Processing":
        return "bg-blue-200 text-blue-500 font-medium";
      case "Shipped":
        return "bg-green-200 text-green-500 font-medium";
      case "Cancelled":
        return "bg-red-200 text-red-500 font-medium";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">ประวัติการเบิก</h1>

      {/* คลุม */}
      <div className="space-y-4">
        {orders?.map((item, index) => {
          return (
            <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md">
              {/* header */}
              <div className="flex justify-between py-2">
                {/* left */}
                <div>
                  <p className="text-sm font-bold">Order Date: {dateFormat(item.updatedAt)}</p>
                </div>

                <div>
                  <span className={`${getStatusColor(item.orderStatus)} 
                  px-2 py-1 rounded-full`}>
                    {item.orderStatus}
                  </span>
                </div>
              </div>

              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-800">
                    <tr className="bg-gray-300 text-center">

                      <th scope="col" className="px-16 py-3">Product</th>
                      <th scope="col" className="px-16 py-3">กลุ่มงาน</th>
                      <th scope="col" className="px-16 py-3">งาน/ฝ่าย</th>
                      <th scope="col" className="px-16 py-3">จำนวน</th>
                    </tr>
                  </thead>

                  <tbody>
                    {item.products?.map((product, index) => {
                      return (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-20"
                          key={index}>

                          <td className="px-6 py-4 font-semibold text-gray-900 text-center dark:text-white">{product.product.title}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900 text-center dark:text-white">{item.dept}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900 text-center dark:text-white">{item.office}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900 text-center dark:text-white">{product.count}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>



              <div className="flex justify-end py-2">
                <button
                  onClick={() => handlePrint(item)}
                  className="flex items-center gap-2 bg-blue-600  text-white px-3 py-2 rounded-md hover:bg-blue-700"
                >
                  <Printer size={18} />
                  พิมพ์ใบเบิก
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <PrintOrder order={printOrder} />
    </div>
  );
};

export default HistoryCard;

