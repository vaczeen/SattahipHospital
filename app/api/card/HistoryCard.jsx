"use client";
import React, { useState, useEffect } from "react";
import { getOrders } from "@/lib/inventory-api/user";
import useEcomStore from "@/store/ecom-store";
import { Printer, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import PrintOrder from "@/app/api/card/PrintOrder";
import { dateFormat } from "@/lib/inventory-utils/dateformat";

const HistoryCard = () => {
  const [orders, setOrders] = useState([]);
  const token = useEcomStore((state) => state.token);
  const [printOrder, setPrintOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        setCurrentPage(1);
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

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-7xl p-6 rounded-2xl shadow-2xl border border-gray-700  bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            ประวัติการเบิก
          </h1>
        </div>

        {/* Order Cards */}
        <div className="space-y-5">
          {paginatedOrders?.map((item, index) => {
            return (
              <div
                key={item.id || (currentPage - 1) * itemsPerPage + index}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-lg"
              >
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <p className="text-sm font-semibold text-gray-300">
                    Order Date: {dateFormat(item.updatedAt)}
                  </p>
                  <span
                    className={`${getStatusColor(item.orderStatus)} px-3 py-1 rounded-full text-xs`}
                  >
                    {item.orderStatus}
                  </span>
                </div>

                {/* Product Table - Desktop */}
                <div className="hidden sm:block relative overflow-x-auto mt-3 rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase">
                          Product
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase">
                          กลุ่มงาน
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase">
                          งาน/ฝ่าย
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-white uppercase">
                          จำนวน
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.products?.map((product, pIndex) => {
                        return (
                          <tr
                            key={pIndex}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors bg-gray-700"
                          >
                            <td className="px-6 py-3 text-center text-white font-medium">
                              {product.product.title}
                            </td>
                            <td className="px-6 py-3 text-center text-white">
                              {item.dept}
                            </td>
                            <td className="px-6 py-3 text-center text-white">
                              {item.office}
                            </td>
                            <td className="px-6 py-3 text-center text-white font-medium">
                              {product.count}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Product Cards - Mobile */}
                <div className="sm:hidden space-y-2 mt-3">
                  {item.products?.map((product, pIndex) => (
                    <div key={pIndex} className="bg-gray-700 border border-white/5 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium text-sm">{product.product.title}</p>
                          <p className="text-gray-400 text-xs mt-1">{item.dept} / {item.office}</p>
                        </div>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                          {product.count} ชิ้น
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Print Button */}
                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => handlePrint(item)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    <Printer size={16} />
                    พิมพ์ใบเบิก
                  </button>
                </div>
              </div>
            );
          })}

          {orders.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 text-lg">ยังไม่มีประวัติการเบิก</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 sm:px-5 py-3 gap-3">
            <span className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              แสดง {(currentPage - 1) * itemsPerPage + 1} -
              {" "}
              {Math.min(currentPage * itemsPerPage, orders.length)} จาก{" "}
              {orders.length} รายการ
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">ก่อนหน้า</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">ถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <PrintOrder order={printOrder} />
    </div>
  );
};

export default HistoryCard;

