"use client";
import React, { useEffect, useState } from "react";
import { getOrdersAdmin } from "@/lib/inventory-api/admin";
import { listReceiveHistory } from "@/lib/inventory-api/receive";
import useEcomStore from "@/store/ecom-store";
import { toast } from "react-toastify";
import { dateFormat } from "@/lib/inventory-utils/dateformat";
import moment from "moment";
import {
  FileText,
  Printer,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PrintReport from "@/app/api/card/PrintReport";
import { M_PLUS_1 } from "next/font/google";

const PAGE_SIZE = 20;
const ReportProduct = () => {
  const token = useEcomStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  const [receiveHistory, setReceiveHistory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [filters, setFilters] = useState({
    product: "ALL",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(filteredMovements.length / PAGE_SIZE));
  const paginatedMovements  = filteredMovements.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [ordersRes, receiveRes] = await Promise.all([
        getOrdersAdmin(token),
        listReceiveHistory(token),
      ]);
      setOrders(ordersRes.data);
      setReceiveHistory(receiveRes.data);
      processMovements(ordersRes.data, receiveRes.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch data");
    }
  };

  const processMovements = (ordersData, receiveData) => {
    let allMovements = [];

    // Process Incoming (Receive)
    receiveData.forEach((item) => {
      allMovements.push({
        productName: item.productName,
        status: "รับเข้า",
        date: item.createdAt,
        fromTo: item.vendor || "ไม่ระบุผู้จำหน่าย", // Mocking based on image or could be item.provider
        quantity: item.quantity,
        type: "IN",
      });
    });

    // Process Outgoing (Orders) - skip Cancelled orders
    ordersData.forEach((order) => {
      if (order.orderStatus === "Cancelled") return;
      order.products?.forEach((p) => {
        allMovements.push({
          productName: p.product.title,
          status: "นำออก",
          date: order.createdAt,
          fromTo: order.office || order.dept,
          quantity: p.count,
          type: "OUT",
        });
      });
    });

    // Sort by Date then Product
    allMovements.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate Running Balance per Product
    const productBalances = {};
    const movementsWithBalance = allMovements.map((m) => {
      if (!productBalances[m.productName]) productBalances[m.productName] = 0;

      if (m.type === "IN") {
        productBalances[m.productName] += m.quantity;
      } else {
        productBalances[m.productName] -= m.quantity;
      }

      return { ...m, balance: productBalances[m.productName] };
    });

    setMovements(movementsWithBalance);
  };

  useEffect(() => {
    let result = movements;

    if (filters.product !== "ALL") {
      result = result.filter((m) => m.productName === filters.product);
    }
    if (filters.startDate) {
      result = result.filter(
        (m) => new Date(m.date) >= new Date(filters.startDate),
      );
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((m) => new Date(m.date) <= end);
    }

    // Final Sort: Date descending for display (latest in/out first in table)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredMovements(result);
  }, [filters, movements]);

  const uniqueProducts = [...new Set(movements.map((m) => m.productName))];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({ product: "ALL", startDate: "", endDate: "" });
    setPage(1);
  };

  const handlePrint = () => {
    setTimeout(() => {
      document.fonts.load("16pt THSarabun").then(() => {
        window.print();
      });
    }, 100);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Filter Bar */}
      <div className="bg-gray-800 shadow-md rounded-xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 sm:w-auto sm:h-auto text-blue-600" />
            Tracking Report
          </h2>
        </div>
        <br />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end bg-gray-700 p-3 sm:p-4 rounded-lg relative">
          <div className="md:col-span-4 flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-400 mb-1">
              Title
            </label>
            <select
              value={filters.product}
              onChange={(e) => handleFilterChange("product", e.target.value)}
              className="bg-gray-200 border border-gray-600 text-gray-950 text-sm rounded-lg p-2.5 min-w-[200px] outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">พัสดุทั้งหมด</option>
              {uniqueProducts.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-400 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="bg-gray-200 border border-gray-700 text-gray-950  text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2 flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-400 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="bg-gray-200 border border-gray-700 text-gray-950  text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-all"
          >
            <RotateCcw size={16} /> Reset
          </button>

          <div className="md:col-span-2 flex flex-col space-y-1">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-all shadow-md"
            >
              <Printer size={18} />
              Export to PDF (Print)
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl shadow-md border border-gray-100 overflow-hidden mt-2">
        <table className="w-full text-xs sm:text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr className="text-center">
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">IN/OUT DATE</th>
              <th className="px-6 py-4">Recieve from/Vendor</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Remaining</th>
            </tr>
          </thead>
          <tbody className=" bg-gray-800 border-b dark:bg-gray-800 dark:border-gray-700 border-gray-700 ">
            {filteredMovements.length > 0 ? (
              paginatedMovements.map((m, index) => (
                <tr key={index} className="hover:bg-gray-600 transition-colors">
                  <td className="px-6 py-4 font-medium text-white ">
                    {m.productName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        m.type === "IN"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-white ">
                    {dateFormat(m.date)}
                  </td>
                  <td className="px-6 py-4 text-center text-white ">
                    {m.fromTo}
                  </td>
                  <td className="px-6 py-4 text-center font-bold">
                    <span
                      className={
                        m.type === "IN" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {m.type === "IN" ? "+" : "-"}
                      {m.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg font-bold">
                      {m.balance}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-400 italic"
                >
                  ไม่พบข้อมูลการเคลื่อนไหวในช่วงเวลานี้
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        {filteredMovements.length > 0 && (
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-700">
            <span className="text-sm text-gray-400">
              แสดง {(page - 1) * PAGE_SIZE + 1} -{" "}
              {Math.min(page * PAGE_SIZE, filteredMovements.length)} จาก{" "}
              {filteredMovements.length} รายการ
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                ก่อนหน้า
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    // แสดงเฉพาะหน้าแรก, หน้าสุดท้าย และหน้ารอบๆ หน้าปัจจุบัน
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - page) <= 1
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            pageNum === page
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (pageNum === 2 && page > 3) {
                      return (
                        <span
                          key={pageNum}
                          className="w-9 h-9 flex items-center justify-center text-sm text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                    if (pageNum === totalPages - 1 && page < totalPages - 2) {
                      return (
                        <span
                          key={pageNum}
                          className="w-9 h-9 flex items-center justify-center text-sm text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  },
                )}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ถัดไป
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Print Component */}
      <PrintReport
        data={filteredMovements}
        startDate={filters.startDate}
        endDate={filters.endDate}
        productName={filters.product}
      />
    </div>
  );
};

export default ReportProduct;
