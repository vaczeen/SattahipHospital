"use client";
import React, { useState, useEffect } from "react";
import {
  createCategory,
  listCategory,
  removeCategory,
} from "@/lib/inventory-api/Category";
import useEcomStore from "@/store/ecom-store";
import { showToast } from "nextjs-toast-notify";
import { dateFormat } from "@/lib/inventory-utils/dateformat";
import { Trash2, ChartBarStacked } from "lucide-react";

const FormCategory = () => {
  const token = useEcomStore((state) => state.token);
  const [name, setName] = useState("");

  //   const [categories, setCategories] = useState([]);
  const categories = useEcomStore((state) => state.categories);
  const getCategory = useEcomStore((state) => state.getCategory);

  useEffect(() => {
    getCategory(token);
  }, []);

  //   const getCategory = async (token) => {
  //     try {
  //       const res = await listCategory(token);
  //       setCategories(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      return showToast.warning("Please fill data");
    }
    try {
      const res = await createCategory(token, { name });
      console.log(res.data.name);
      showToast.success(`Add Category ${res.data.name} SuccessFully!!`);
      getCategory(token);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (id) => {
    console.log(id);
    try {
      const res = await removeCategory(token, id);
      console.log(res);
      showToast.success(`Delete ${res.data.name} success`);
      getCategory(token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 shadow-md rounded-xl p-4">
        <div className="flex items-center gap-3 justify-between mb-2">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <ChartBarStacked className="w-8 h-8 text-blue-600" />
            Category Management
          </h2>
        </div>
        <br />
        <form className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2" onSubmit={handleSubmit}>
          <input
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-200 border border-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 flex-1"
            type="text"
            placeholder="Enter Category Name"
          />{" "}
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
            Add Category
          </button>
        </form>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
        <table className="w-full text-xs sm:text-sm text-left rtl:text-right text-gray-400">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr className="text-center">
              <th className="px-3 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Category ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                CreatedAt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((item, index) => {
              return (
                <tr
                  className="bg-gray-800 border-b dark:bg-gray-800 dark:border-gray-700 border-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600"
                  key={index}
                >
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {dateFormat(item.createdAt)}
                  </td>
                  <td className="px-6 py-6 text-left flex">
                    <a
                      className="font-medium text-black bg-red-500 p-1 rounded-md shadow-md  hover:scale-105 hover:-translate-y-1 hover:duration-200"
                      onClick={() => handleRemove(item.id)}
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
    </div>
  );
};

export default FormCategory;
