"use client";
import React, { useState, useEffect } from "react";
import useEcomStore from "@/store/ecom-store";
import {
  createProduct,
  listProduct,
  readProduct,
  updateProduct,
} from "@/lib/inventory-api/Product";
import { showToast } from "nextjs-toast-notify";
import Uploadfile from "./Uploadfile";
import { Save, Trash2, Pencil, PackageSearch } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const initialState = {
  title: "",
  description: "",
  unit: "",
  quantity: 0,
  categoryId: "",
  images: [],
};

const FormEditProduct = () => {
  const { id } = useParams();
  const router = useRouter();

  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const [form, setForm] = useState(initialState);
  // console.log(products);

  useEffect(() => {
    getCategory();
    fetchProduct(token, id, form);
  }, []);

  const fetchProduct = async (token, id, form) => {
    try {
      const res = await readProduct(token, id, form);
      console.log("res from backend", res);
      setForm(res.data);
    } catch (error) {
      console.log("Error fetch data", error);
    }
  };

  const handleOnchange = (e) => {
    console.log(e.target.name, e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProduct(token, id, form);
      console.log(res);
      setForm(initialState);
      showToast.success(`เพิ่มข้อมูล ${res.data.title} สำเร็จ`);
      router("/admin/product");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6">
      <form onSubmit={handleSubmit}>
        <div className="bg-gray-800 shadow-md rounded-xl p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-3">
            <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2 text-white">
              <PackageSearch className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              Edit Product
            </h2>
          </div>
          <br />

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-end bg-gray-700 p-3 sm:p-4 rounded-lg relative">
              <div className="md:col-span-4 flex flex-col space-y-1">
                <span className="px-1 font-bold text-gray-400">Title</span>
                <input
                  className="bg-gray-200  border border-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  value={form.title}
                  onChange={handleOnchange}
                  placeholder="Title"
                  name="title"
                />
              </div>

              <div className="md:col-span-2 flex flex-col space-y-1">
                <span className="px-1 font-bold text-gray-400">
                  Description
                </span>
                <input
                  className="bg-gray-200  border border-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  value={form.description}
                  onChange={handleOnchange}
                  placeholder="Description"
                  name="description"
                />
              </div>

              <div className="md:col-span-2 flex flex-col space-y-1">
                <span className="px-1 font-bold text-gray-400">Unit</span>
                <input
                  type="text"
                  className="bg-gray-200  border border-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  value={form.unit}
                  onChange={handleOnchange}
                  placeholder="หน่วย"
                  name="unit"
                />
              </div>

              <div className="md:col-span-2 flex flex-col space-y-1">
                <span className="px-1 font-bold text-gray-400">Quantity</span>
                <input
                  type="number"
                  className="bg-gray-200  border border-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  value={form.quantity}
                  onChange={handleOnchange}
                  placeholder="Quantity"
                  name="quantity"
                />
              </div>

              <div className="md:col-span-2 flex flex-col space-y-1">
                <span className="px-1 font-bold text-gray-400 ">Filter</span>
                <select
                  className="bg-gray-200  border border-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  name="categoryId"
                  onChange={handleOnchange}
                  required
                  value={form.categoryId}
                >
                  <option value="" disabled>
                    Please Select
                  </option>
                  {categories.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="py-1 px-1">
            {/* upload file img */}
            <Uploadfile form={form} setForm={setForm} />
          </div>
          <div
            onClick={() => router.push("/inventory/admin/product")}
            className="flex justify-end pt-4 border-t border-gray-400 mt-2"
          >
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
              <Pencil className="w-5 h-5" />
              แก้ไขพัสดุ
            </button>
          </div>
        </div>
        <hr />
      </form>
    </div>
  );
};

export default FormEditProduct;
