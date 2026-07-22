"use client";
import React, { useEffect, useState } from "react";
import useEcomStore from "@/store/ecom-store";

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
    const inCheck = e.target.value; //ค่าที่เรา tik
    const inState = [...categorySelected]; //[] arr ว่าง
    const findCheck = inState.indexOf(inCheck); //ถ้าไม่เจอ จะ return -1

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
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border">
      <h1 className="text-2xl font-bold mb-4">ค้นหาพัสดุ</h1>
      {/* search by text */}
      <input
        onChange={(e) => setText(e.target.value)}
        type="text"
        placeholder="ค้นหาพัสดุ"
        className="border rounded-md w-full mb-4"
      />

      {/* search by category */}
      <div>
        <h1 className="text-md font-bold mb-2">หมวดหมู่สินค้า</h1>
        <div >
          {categories.map((item, index) => (
            <div className="flex gap-2" key={index}>
              <input onChange={handleCheck} value={item.id} type="checkbox" />
              <label>{item.name}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchCard;

