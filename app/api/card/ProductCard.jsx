"use client";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react"
import useEcomStore from "@/store/ecom-store";

const ProductCard = ({ item }) => {
  const actionAddToCart = useEcomStore((state) => state.actionAddToCart);

  return (

    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,

      }}

    >

      <div className="bg-white border-2 rounded-md shadow-md px-2 py-4 w-60">
        <div>
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0].url}
              className="rounded-md w-full h-24 object-cover hover:scale-110 hover:duration-200"
            />
          ) : (
            <div className="w-full h-24 bg-gray-200 rounded-md text-center flex items-center justify-center shadow">
              No Image
            </div>
          )}
        </div>

        <div className="py-2">
          <p className="text-xl">{item.title}</p>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>

        <div className="flex justify-between  items-center">
          <span className="text-sm font-bold">Stock: {item.quantity}</span>
          <button
            onClick={() => actionAddToCart(item)}
            className="bg-blue-500 rounded-md p-2 hover:bg-blue-700 shadow-md"
          >
            <ShoppingCart />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

