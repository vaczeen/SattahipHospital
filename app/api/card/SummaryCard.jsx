"use client";
import React, { useState, useEffect } from "react";
import { saveOrder, listUserCart } from "@/lib/inventory-api/user";
import useEcomStore from "@/store/ecom-store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ClipboardList, Building2, Package } from "lucide-react";

const SummaryCard = () => {
  const token = useEcomStore((state) => state.token);
  const clearCart = useEcomStore((state) => state.clearCart);
  const getDepartment = useEcomStore((state) => state.getDepartment);
  const department = useEcomStore((state) => state.department);
  const [products, setProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const router = useRouter();

  const uniqueOffice = [...department]
    .sort((a, b) => parseInt(a.deptcode, 10) - parseInt(b.deptcode, 10))
    .filter(
      (item, index, self) =>
        index === self.findIndex((d) => d.office === item.office)
    );

  const handleOfficeChange = (e) => {
    const selectedOffice = e.target.value;
    const matched = department.find((row) => row.office === selectedOffice);
    setForm({
      office: selectedOffice,
      dept: matched?.dept || "",
      deptcode: matched?.deptcode || "",
    });
  };

  const [form, setForm] = useState({
    dept: "",
    office: "",
    deptcode: "",
  });

  const handleGetUserCart = (token) => {
    listUserCart(token)
      .then((res) => {
        console.log(res);
        setProducts(res.data.products);
        setCartTotal(res.data.cartTotal);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleGoToPrint = () => {
    if (!form.office || !form.dept || !form.deptcode) {
      return toast.warning("กรุณาใส่หน่วยงานก่อน");
    }
    saveOrder(token, form)
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        clearCart();
        router.push("/inventory/user/history");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message || "Save Order Failed");
      });
  };

  useEffect(() => {
    getDepartment();
    handleGetUserCart(token);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex items-start justify-center px-4 pt-4 pb-10">
      <div className="w-full max-w-7xl p-6 rounded-2xl shadow-2xl border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            สรุปรายการเบิกพัสดุ
          </h1>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left - ข้อมูลหน่วยงาน */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white">ข้อมูลหน่วยงาน</h2>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-400">จากฝ่าย/งาน</label>
              <select
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                name="office"
                onChange={handleOfficeChange}
                required
                value={form.office}
              >
                <option value="" disabled className="text-gray-900">
                  Please Select
                </option>
                {uniqueOffice.map((item) => (
                  <option key={item.id} value={item.office} className="text-gray-900">
                    {item.deptcode} {item.office}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-400">กลุ่มงาน</label>
              <input
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-2.5 cursor-not-allowed "
                value={form.dept}
                readOnly
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-400">รหัสแผนงาน</label>
              <input
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-2.5 cursor-not-allowed "
                value={form.deptcode}
                readOnly
              />
            </div>
          </div>

          {/* Right - รายการสินค้า */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-bold text-white">
                รายการที่ขอเบิก ({products.length} รายการ)
              </h2>
            </div>

            {/* Item List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto hide-scrollbar pr-1">
              {products?.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="font-bold text-white">{item.product.title}</p>
                  </div>
                  <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg font-bold text-sm whitespace-nowrap">
                    {item.count} ชิ้น
                  </div>
                </div>
              ))}
            </div>

            {/* Confirm Button */}
            <div className="mt-5">
              <button
                onClick={handleGoToPrint}
                className="bg-green-600 w-full rounded-xl text-white py-2.5 font-medium hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                ยืนยันการเบิก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
