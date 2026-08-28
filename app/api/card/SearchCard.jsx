"use client";
import React, { useEffect, useState } from "react";
import useEcomStore from "@/store/ecom-store";
import { Search, Package, X } from "lucide-react";

const SearchCard = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const actionSearchFilters = useEcomStore(
    (state) => state.actionSearchFilters
  );
  const [text, setText] = useState("");
  const [categorySelected, setcategorySelected] = useState([]);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    getCategory();
  }, []);

  //step 1 search text
  useEffect(() => {
    const delay = setTimeout(() => {
      if (text) {
        actionSearchFilters({ query: text });
      } else {
        getProduct();
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [text]);

  //step 2 search category
  const handleCheck = (e) => {
    const inCheck = e.target.value;
    const inState = [...categorySelected];
    const findCheck = inState.indexOf(inCheck);

    if (findCheck == -1) {
      inState.push(inCheck);
    } else {
      inState.splice(findCheck, 1);
    }

    setcategorySelected(inState);

    if (inState.length > 0) {
      actionSearchFilters({ category: inState });
    } else {
      getProduct();
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
          <Package className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          ค้นหาพัสดุ
        </h1>
      </div>

      {/* Search Bar - Highlighted */}
      <div className="relative group mb-5">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-400 via-white to-gray-400 rounded-xl opacity-60 group-hover:opacity-100 blur transition duration-300" />
        <div className="relative flex items-center bg-gray-900 rounded-xl overflow-hidden">
          <div className="pl-4 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            onChange={(e) => setText(e.target.value)}
            type="text"
            placeholder="พิมพ์ชื่อพัสดุเพื่อค้นหา..."
            value={text}
            className="w-full px-3 py-3.5 bg-transparent text-white placeholder-gray-500 text-sm outline-none"
          />
          {text && (
            <button
              onClick={() => setText("")}
              className="pr-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          หมวดหมู่สินค้า
        </h2>
        <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
          {categories.map((item, index) => (
            <label
              key={index}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
            >
              <div className="relative flex items-center justify-center">
                <input
                  onChange={handleCheck}
                  value={item.id}
                  type="checkbox"
                  className="peer sr-only"
                />
                <div className="w-4 h-4 rounded border-2 border-gray-600 peer-checked:bg-white peer-checked:border-white transition-all flex items-center justify-center">
                  {categorySelected.includes(item.id) && (
                    <svg
                      className="w-2.5 h-2.5 text-gray-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {item.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
