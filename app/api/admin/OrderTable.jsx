"use client";
import React, { useEffect, useState } from "react";
import { getOrdersAdmin, changeOrderStatus } from "@/lib/inventory-api/admin";
import useEcomStore from "@/store/ecom-store";
import { toast } from "react-toastify";
import { dateFormat } from "@/lib/inventory-utils/dateformat";
import * as XLSX from "xlsx";
import moment from "moment";
import { RotateCcw, PackageSearch } from "lucide-react";

const OrderTable = () => {
  const token = useEcomStore((state) => state.token);
  const [orders, setOrders] = useState([]);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    user: "ALL",
    dept: "ALL",
    office: "ALL",
    product: "ALL",
    status: "ALL",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    handlegetOrder(token);
  }, []);

  useEffect(() => {
    let result = orders;

    if (filters.user !== "ALL") {
      result = result.filter((item) => item.orderedBy.email === filters.user);
    }
    if (filters.dept !== "ALL") {
      result = result.filter((item) => item.dept === filters.dept);
    }
    if (filters.office !== "ALL") {
      result = result.filter((item) => item.office === filters.office);
    }
    if (filters.product !== "ALL") {
      result = result.filter((item) =>
        item.products?.some((p) => p.product.title === filters.product),
      );
    }
    if (filters.status !== "ALL") {
      result = result.filter((item) => item.orderStatus === filters.status);
    }
    if (filters.startDate) {
      result = result.filter(
        (item) => new Date(item.createdAt) >= new Date(filters.startDate),
      );
    }
    if (filters.endDate) {
      // Set end date to end of day
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((item) => new Date(item.createdAt) <= end);
    }

    setFilteredOrders(result);
  }, [filters, orders]);

  // Get unique emails for filter
  const uniqueEmails = [...new Set(orders.map((item) => item.orderedBy.email))];
  // Get unique department for filter
  const uniqueDept = [...new Set(orders.map((item) => item.dept))];
  // Get unique department for filter
  const uniqueOffice = [...new Set(orders.map((item) => item.office))];
  // Get unique products for filter
  const uniqueProducts = [
    ...new Set(
      orders.flatMap(
        (item) => item.products?.map((p) => p.product.title) || [],
      ),
    ),
  ];
  // Get unique statuses for filter
  const uniqueStatuses = [...new Set(orders.map((item) => item.orderStatus))];

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      user: "ALL",
      dept: "ALL",
      office: "ALL",
      product: "ALL",
      status: "ALL",
      startDate: "",
      endDate: "",
    });
  };

  const handlegetOrder = (token) => {
    getOrdersAdmin(token)
      .then((res) => {
        console.log(res);
        // เรียง order จากล่าสุดขึ้นมาข้างบนก่อน
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setOrders(sorted);
        setFilteredOrders(sorted);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeOrderStatus = (token, orderId, orderStatus) => {
    changeOrderStatus(token, orderId, orderStatus)
      .then((res) => {
        console.log(res);
        toast.success("Update Status Success");
        handlegetOrder(token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-200 text-gray-500 font-medium";
      case "Processing":
        return "bg-blue-200 text-blue-500 font-medium";
      case "Shipped":
        return "bg-green-200 text-green-700 font-medium";
      case "Cancelled":
        return "bg-red-200 text-red-500 font-medium";
    }
  };

  const handleExportExcel = () => {
    // 1. ดึงรายชื่อ Office ทั้งหมด (ไม่ซ้ำ)
    const offices = Array.from(
      new Set(filteredOrders.map((order) => order.office)),
    );

    // 2. สร้างโครงสร้าง Pivot: Product -> Office -> Quantity
    const productMap = {};

    filteredOrders.forEach((order) => {
      order.products?.forEach((item) => {
        const product = item.product.title;
        const qty = item.count;
        const office = order.office;

        if (!productMap[product]) {
          productMap[product] = {};
        }

        productMap[product][office] = (productMap[product][office] || 0) + qty;
      });
    });

    // 3. แปลงข้อมูลให้อยู่ในรูปที่ Excel ต้องการ
    const dataToExport = [];

    Object.entries(productMap).forEach(([product, officeData]) => {
      const row = { "พัสดุ/หน่วยงาน": product };
      let total = 0;

      offices.forEach((office) => {
        const value = officeData[office] || 0;
        row[office] = value;
        total += value;
      });

      row["รวม"] = total;
      dataToExport.push(row);
    });

    // Prepare Footer and Filename
    let footerText = "ข้อมูลทั้งหมด";
    let fileName = "Order_Summary_All.xlsx";

    if (filters.startDate && filters.endDate) {
      const startStr = moment(filters.startDate).format("DD/MM/YYYY");
      const endStr = moment(filters.endDate).format("DD/MM/YYYY");
      footerText = `ข้อมูล ณ วันที่ ${startStr}-${endStr}`;

      const startFile = moment(filters.startDate).format("DD-MM-YYYY");
      const endFile = moment(filters.endDate).format("DD-MM-YYYY");
      fileName = `Order_Summary_${startFile}_to_${endFile}.xlsx`;
    }

    // Append footer row
    // We put the text in the first column ("พัสดุ/หน่วยงาน")
    dataToExport.push({ "พัสดุ/หน่วยงาน": footerText });

    // 4. สร้าง Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport, {
      header: ["พัสดุ/หน่วยงาน", ...offices, "รวม"],
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order Summary");

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="container mx-auto p-4 ">
      {/* Filter Bar */}
      <div className="bg-gray-800 shadow-md rounded-xl p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-white">
            <PackageSearch className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Product List
          </h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-gray-200 transition-all shadow-md text-sm"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-green-700 transition-all shadow-md text-sm"
            >
              Export to Excel
            </button>
          </div>
        </div>

        <br />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 xl:grid-cols-14 gap-2 items-end bg-gray-700 p-3 sm:p-4 rounded-lg relative">
          <div className="md:col-span-2 flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-400 mb-1">
              User
            </label>
            <select
              value={filters.user}
              onChange={(e) => handleFilterChange("user", e.target.value)}
              className="bg-gray-200 border border-gray-700  text-gray-600  text-sm rounded-lg p-2.5 "
            >
              <option value="ALL">All Users</option>
              {uniqueEmails.map((email, index) => (
                <option key={index} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-400 mb-1">
              Department
            </label>
            <select
              value={filters.dept}
              onChange={(e) => handleFilterChange("dept", e.target.value)}
              className="bg-gray-200 border border-gray-700 text-gray-600 text-sm rounded-lg p-2.5"
            >
              <option value="ALL">All Depts</option>
              {uniqueDept.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-400 mb-1">
              Office
            </label>
            <select
              value={filters.office}
              onChange={(e) => handleFilterChange("office", e.target.value)}
              className="bg-gray-200 border border-gray-700  text-gray-600 text-sm rounded-lg p-2.5 "
            >
              <option value="ALL">All Offices</option>
              {uniqueOffice.map((office, index) => (
                <option key={index} value={office}>
                  {office}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-400 mb-1">
              Product
            </label>
            <select
              value={filters.product}
              onChange={(e) => handleFilterChange("product", e.target.value)}
              className="bg-gray-200 border border-gray-700 text-gray-600 text-sm rounded-lg p-2.5 "
            >
              <option value="ALL">All Products</option>
              {uniqueProducts.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-400 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="bg-gray-200 border border-gray-700 text-gray-600 text-sm rounded-lg p-2.5 "
            >
              <option value="ALL">All Status</option>
              {uniqueStatuses.map((status, index) => (
                <option key={index} value={status}>
                  {status}
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
              className="bg-gray-200 border border-gray-700 text-gray-600 text-sm rounded-lg p-2.5"
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
              className="bg-gray-200 border border-gray-700 text-gray-600 text-sm rounded-lg p-2.5"
            />
          </div>
        </div>
      </div>

      {/* table */}        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
        <table className="w-full text-xs sm:text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
            <tr className="text-center">
              <th className="px-3 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Office
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                CreatedAt
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Change Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.map((item, index) => {
              return (
                <tr
                  className="bg-gray-800 border-b dark:bg-gray-800 dark:border-gray-700 border-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600"
                  key={index}
                >
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {item.orderedBy.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {item.dept}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {item.office}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {item.products?.map((product, index) => (
                      <li key={index}>
                        {product.product.title}
                        {"  "}
                        <span className="text-sm">x {product.count}</span>
                      </li>
                    ))}
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap text-sm text-white">
                    {dateFormat(item.createdAt)}
                  </td>

                  <td>
                    <span
                      className={`${getStatusColor(item.orderStatus)} px-2 py-1 rounded-full`}
                    >
                      {item.orderStatus}
                    </span>
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap text-sm text-white">
                    <select
                      value={item.orderStatus}
                      onChange={(e) =>
                        handleChangeOrderStatus(token, item.id, e.target.value)
                      }
                      className="bg-gray-700 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
