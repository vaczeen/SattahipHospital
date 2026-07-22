"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useEcomStore from "@/store/ecom-store";
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
} from "lucide-react";
import PrintReceive from "@/app/api/card/PrintReceive";

const RecieveProduct = () => {
  const token = useEcomStore((state) => state.token);
  const [history, setHistory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
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
  }, []);

  const loadHistory = (token) => {
    listReceiveHistory(token)
      .then((res) => {
        setHistory(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
        <div className="flex items-center justify-between  pb-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold  flex items-center gap-2 text-white">
              Revieve Products
            </h2>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors shadow-md"
          >
            <Printer className="w-5 h-5" /> พิมพ์รายการที่เลือก (
            {selectedItems.length})
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
                  <input
                    type="text"
                    name="productName"
                    value={form.productName}
                    onChange={(e) => handleChange(index, e)}
                    placeholder="กรอกชื่อพัสดุ"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-200"
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
                history.map((item, index) => {
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
                        {index + 1}
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
      </div>

      {/* Hidden Print Component */}
      <PrintReceive items={selectedItems} />
    </div>
  );
};

export default RecieveProduct;
