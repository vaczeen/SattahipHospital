import React, { useState, useEffect } from "react";
import useEcomStore from "@/store/ecom-store";
import { createProduct, deleteProduct } from "@/lib/inventory-api/Product";
import { showToast } from "nextjs-toast-notify";
import Uploadfile from "./Uploadfile";
import Link from "next/link";

import { Save, Trash2, Pencil, PackageSearch } from "lucide-react";

const initialState = {
  title: "",
  description: "",
  price: 0,
  unit: "",
  quantity: 0,
  categoryId: "",
  images: [],
};

const FormProduct = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    unit: "",
    quantity: 0,
    categoryId: "",
    images: [],
  });
  // console.log(products);

  const handleOnchange = (e) => {
    console.log(e.target.name, e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct(token, form);
      console.log(res);
      setForm(initialState);
      getProduct();
      showToast.success(`เพิ่มข้อมูล ${res.data.title} สำเร็จ`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure for Delete?")) {
      try {
        const res = await deleteProduct(token, id);
        console.log(res);
        showToast.success("Deleted product success!!");
        getProduct();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getCategory(token);
    getProduct(20);
  }, []);
  console.log(categories);

  return (
    <div className="container mx-auto p-6 ">
      <form onSubmit={handleSubmit}>
        <div className="bg-gray-800 shadow-md rounded-xl p-4 ">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold  flex items-center gap-2 text-white">
              <PackageSearch  className="w-8 h-8 text-blue-600"/>
              Product List
            </h2>
          </div>
          <br />
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-700 p-4 rounded-lg relative">
              <div className="md:col-span-4 flex flex-col space-y-1">
                <span className="px-1 font-bold text-gray-400">Title</span>
                <input
                  className="bg-gray-200 border border-gray-700  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5"
                  value={form.title}
                  onChange={handleOnchange}
                  placeholder="Title"
                  name="title"
                />
              </div>

              <div className="md:col-span-2 flex flex-col space-y-1">
                <span className="px-1 font-bold text-gray-400">Description</span>
                <input
                  className="bg-gray-200 border border-gray-700  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  value={form.description}
                  onChange={handleOnchange}
                  placeholder="Description"
                  name="description"
                />
              </div>

              <div className="md:col-span-2 flex flex-col space-y-1">
                <span className="px-1.5 font-bold text-gray-400">Unit</span>
                <input
                  type="text"
                  className="bg-gray-200 border border-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  value={form.unit}
                  onChange={handleOnchange}
                  placeholder="หน่วย"
                  name="unit"
                />
              </div>

              <div className="md:col-span-2 flex flex-col space-y-1">
                <span className="px-1.5 font-bold text-gray-400">Filter</span>
                <select
                  className="bg-gray-200 border border-gray-700 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
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

            <div>
              {/* <div className="py-1 px-6">
                <span className="px-1 font-bold">Quantity</span>
                <input
                  type="number"
                  className="bg-gray-700 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={form.quantity}
                  onChange={handleOnchange}
                  placeholder="Quantity"
                  name="quantity"
                />
              </div> */}
            </div>
          </div>

          <div className="py-1 px-1">
            {/* upload file img */}
            <Uploadfile form={form} setForm={setForm} />
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-400 mt-2">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
              <Save className="w-5 h-5" /> เพิ่มพัสดุ
            </button>
          </div>
        </div>

        <hr />

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
          <table className="w-full text-sm text-left rtl:text-right text-gray-400">
            <thead className="text-xs  uppercase bg-gray-700 text-gray-400">
              <tr className="text-center">
                <th scope="col" className="px-1 py-3">
                  Number
                </th>
                <th scope="col" className="px-16 py-3">
                  Image
                </th>
                <th scope="col" className="px-16 py-3">
                  Product
                </th>
                <th scope="col" className="px-2 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Unit
                </th>
                <th scope="col" className="px-4 py-3">
                  Qty
                </th>
                <th scope="col" className="px-4 py-3">
                  sold
                </th>
                <th scope="col" className="px-6 py-3">
                  updateAt
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => {
                console.log(item);
                return (
                  <tr
                    className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600"
                    key={index}
                  >
                    <td className="px-10 py-4 font-semibold text-center text-white">
                      {index + 1}
                    </td>
                    <td className="p-4">
                      {item.images.length > 0 ? (
                        <img
                          className="w-40 h-24 rounded-lg shadow-md"
                          src={item.images[0].url}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-md flex item-center justify-center shadow-sm ">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold  text-center text-white ">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 font-semibold  text-center text-white justify-center ">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 font-semibold  text-center text-white justify-center ">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4 font-semibold  text-center text-white">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 font-semibold  text-center text-white">
                      {item.sold}
                    </td>
                    <td className="px-6 py-4 font-semibold  text-center text-white">
                      {item.updatedAt}
                    </td>
                    <td className="px-3 py-6 grid  text-center justify-center items-center">
                      <Link
                        href={"/inventory/admin/product/" + item.id}
                        className="font-medium bg-yellow-400 p-1 rounded-md shadow-md text-black hover:scale-105 hover:-translate-y-1 hover:duration-200"
                      >
                        <Pencil />
                      </Link>

                      <br />
                      <a
                        href="#"
                        onClick={() => handleDelete(item.id)}
                        className="font-medium text-black bg-red-500 p-1 rounded-md shadow-md  hover:scale-105 hover:-translate-y-1 hover:duration-200"
                      >
                        <Trash2 />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
};

export default FormProduct;
