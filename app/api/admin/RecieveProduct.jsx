"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import useEcomStore from "@/store/ecom-store";
import { listProduct } from "@/lib/inventory-api/Product";
import {
  createReceiveRecord,
  listReceiveHistory,
  removeReceiveRecord,
} from "@/lib/inventory-api/receive";
import { dateFormat } from "@/lib/inventory-utils/dateformat";
import {
  Save,
  Trash2,
  History,
  Package,
  Plus,
  FileText,
  Printer,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PrintReceive from "@/app/api/card/PrintReceive";

// Combobox ที่พิมพ์ค้นหาได้ โดยดึงรายชื่อสินค้าจากตาราง Product (field title)
const ProductTitleSelect = ({ value, onChange, onSelect, products }) => {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef(null);

  // กรองสินค้าตามคำที่พิมพ์ (ไม่แยกตัวพิมพ์เล็กใหญ่)
  const filtered = useMemo(() => {
    const q = (value || "").trim().toLowerCase();
    const list = q
      ? products.filter((p) =>
          (p.title || "").toLowerCase().includes(q),
        )
      : products;
    return list.slice(0, 50);
  }, [products, value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!open && e.key === "ArrowDown") {
      setOpen(true);
      setHighlight(0);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && filtered[highlight]) {
        e.preventDefault();
        onSelect(filtered[highlight]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        name="productName"
        value={value}
        onChange={(e) => {
          onChange(e);
          setOpen(true);
          setHighlight(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="พิมพ์เพื่อค้นหาหรือกรอกชื่อพัสดุ"
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-200"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filtered.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(p);
                }}
                onMouseEnter={() => setHighlight(i)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  i === highlight
                    ? "bg-blue-500 text-white"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                {p.title}
                {p.unit && (
                  <span
                    className={`ml-1 text-xs ${
                      i === highlight ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    ({p.unit})
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg">
          <li className="px-4 py-2 text-sm text-gray-400">ไม่พบรายการสินค้า</li>
        </ul>
      )}
    </div>
  );
};

const PAGE_SIZE = 20;

const RecieveProduct = () => {
  const token = useEcomStore((state) => state.token);
  const [history, setHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
  const paginatedHistory = history.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // ถ้าหน้าปัจจุบันเกินจำนวนหน้าหลังจากลบข้อมูล ให้กลับไปหน้าที่ถูกต้อง
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);
  const [formList, setFormList] = useState([
    {
      productName: "",
      unit: "",
      quantity: "",
      vendor: "",
      receiveDate: new Date().toISOString().split("T")[0],
    },
  ]);

  useEffect(() => {
    loadHistory(token);
    loadProducts();
  }, []);

  const loadHistory = (token) => {
    listReceiveHistory(token)
      .then((res) => {
        // เรียงจากวันที่ทำรายการ (updatedAt) ล่าสุดก่อน
        const sorted = [...res.data].sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
        setHistory(sorted);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadProducts = () => {
    listProduct(1000)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // เลือกสินค้าจาก dropdown: ใส่ชื่อ และเติมหน่วยนับ (unit) ให้อัตโนมัติ
  const handleTitleSelect = (index, product) => {
    const newFormList = [...formList];
    newFormList[index].productName = product.title;
    if (product.unit) {
      newFormList[index].unit = product.unit;
    }
    setFormList(newFormList);
  };

  const handleChange = (index, e) => {
    const newFormList = [...formList];
    newFormList[index][e.target.name] = e.target.value;
    setFormList(newFormList);
  };

  const addRow = () => {
    setFormList([
      ...formList,
      {
        productName: "",
        unit: "",
        quantity: "",
        vendor: "",
        receiveDate: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const removeRow = (index) => {
    if (formList.length > 1) {
      const newFormList = [...formList];
      newFormList.splice(index, 1);
      setFormList(newFormList);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all rows
    const isValid = formList.every(
      (row) => row.productName && row.unit && row.quantity && row.receiveDate,
    );
    if (!isValid) {
      return toast.warning("กรุณากรอกข้อมูลให้ครบทุกช่อง");
    }

    createReceiveRecord(token, formList)
      .then((res) => {
        toast.success("บันทึกข้อมูลสำเร็จ");
        setFormList([
          {
            productName: "",
            unit: "",
            quantity: "",
            vendor: "",
            receiveDate: new Date().toISOString().split("T")[0],
          },
        ]);
        setPage(1);
        loadHistory(token);
      })
      .catch((err) => {
        console.log(err);
        toast.error("เกิดข้อผิดพลาด");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("ยืนยันการลบ?")) {
      removeReceiveRecord(token, id)
        .then((res) => {
          toast.success("ลบข้อมูลสำเร็จ");
          loadHistory(token);
          // Remove from selected if deleted
          setSelectedItems(selectedItems.filter((item) => item.id !== id));
        })
        .catch((err) => {
          console.log(err);
          toast.error("เกิดข้อผิดพลาดในการลบ");
        });
    }
  };

  const handleSelect = (item) => {
    const index = selectedItems.findIndex((i) => i.id === item.id);
    if (index > -1) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === history.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(history);
    }
  };

  const handlePrint = () => {
    if (selectedItems.length === 0) {
      return toast.warning("กรุณาเลือกรายการที่ต้องการพิมพ์");
    }
    setTimeout(() => {
      document.fonts.load("16pt THSarabun").then(() => {
        window.print();
      });
    }, 100);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="bg-gray-800 shadow-md rounded-xl p-4 ">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-3">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-white">
              Revieve Products
            </h2>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors shadow-md text-sm"
          >
            <Printer className="w-4 h-4 sm:w-5 sm:h-5" /> พิมพ์ ({selectedItems.length})
          </button>
        </div>

        {/* Form Section */}
        <div className="bg-gray-700 shadow-md rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold  flex items-center gap-2 text-white">
              <FileText className="w-5 h-5" /> รายการรับพัสดุ
            </h2>
            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-1 text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="w-4 h-4" /> เพิ่มแถว
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formList.map((form, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-600 p-4 rounded-lg relative"
              >
                <div className="md:col-span-1 text-xs font-bold text-white absolute -top-2 left-4 bg-gray-600 px-2 rounded">
                  #{index + 1}
                </div>
                <div className="md:col-span-4 flex flex-col space-y-1">
                  <label className="text-xs font-medium text-white ">
                    Title
                  </label>
                  <ProductTitleSelect
                    value={form.productName}
                    onChange={(e) => handleChange(index, e)}
                    onSelect={(product) => handleTitleSelect(index, product)}
                    products={products}
                  />
                </div>
                <div className="md:col-span-2 flex flex-col space-y-1">
                  <label className="text-xs font-medium text-white ">
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={form.unit}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="หน่วยนับ"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-200"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col space-y-1">
                  <label className="text-xs font-medium text-white ">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="จำนวน"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-200"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col space-y-1">
                  <label className="text-xs font-medium text-white">
                    Vendor
                  </label>
                  <input
                    type="text"
                    name="vendor"
                    value={form.vendor}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="ชื่อผู้จำหน่าย"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-200"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col space-y-1">
                  <label className="text-xs font-medium text-white ">
                    Recieve Date
                  </label>
                  <input
                    type="date"
                    name="receiveDate"
                    value={form.receiveDate}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-200"
                  />
                </div>
                <div className="md:col-span-1 flex justify-center">
                  {formList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4 border-t mt-6">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Save className="w-5 h-5" /> บันทึกรายการทั้งหมด (
                {formList.length})
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-gray-800 rounded-xl shadow-md border border-gray-100 overflow-hidden mt-2">
        <div className="p-6  flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-white" /> ประวัติการรับพัสดุ
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white">เลือกทั้งหมด</span>
            <button
              onClick={handleSelectAll}
              className="text-white hover:text-gray-400 transition-colors"
            >
              {selectedItems.length === history.length && history.length > 0 ? (
                <CheckSquare className="w-6 h-6" />
              ) : (
                <Square className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700 text-white uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4 w-12">Check</th>
                <th className="px-6 py-4">No.</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Recieve Date</th>
                <th className="px-6 py-4 text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.length > 0 ? (
                paginatedHistory.map((item, index) => {
                  const isSelected = selectedItems.some(
                    (i) => i.id === item.id,
                  );
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-600 transition-colors ${isSelected ? "bg-gray-600" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelect(item)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {(page - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {item.productName}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {item.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-semibold">
                          {item.quantity.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {dateFormat(item.updatedAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                          title="ลบรายการ"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-400 italic"
                  >
                    ไม่มีข้อมูลการรับพัสดุ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {history.length > 0 && (
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-700">
            <span className="text-sm text-gray-400">
              แสดง {(page - 1) * PAGE_SIZE + 1} -{" "}
              {Math.min(page * PAGE_SIZE, history.length)} จาก{" "}
              {history.length} รายการ
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
                    if (
                      pageNum === 2 &&
                      page > 3
                    ) {
                      return (
                        <span
                          key={pageNum}
                          className="w-9 h-9 flex items-center justify-center text-sm text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                    if (
                      pageNum === totalPages - 1 &&
                      page < totalPages - 2
                    ) {
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

      {/* Hidden Print Component */}
      <PrintReceive items={selectedItems} />
    </div>
  );
};

export default RecieveProduct;
