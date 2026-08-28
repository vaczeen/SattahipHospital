"use client";
import React, { useState } from "react";
import axios from "@/lib/axios";
import { showToast } from "nextjs-toast-notify";
import useEcomStore from "@/store/ecom-store";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

const Login = () => {
  //javascript
  const router = useRouter();
  const actionLogin = useEcomStore((state) => state.actionLogin);
  const user = useEcomStore((state) => state.user);
  console.log("user form zustand", user);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    // console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handeleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actionLogin(form);
      const role = res.data.payload.role;
      console.log("role", role);
      roleRedirect(role);
      showToast.success("Welcome Back");
    } catch (error) {
      console.log(error);
      const errMsg = error.response?.data?.message;
      showToast.error(errMsg);
    }
  };

  const roleRedirect = (role) => {
    if (role === "admin") {
      router.push("/inventory/admin");
    } else {
      router.back();
    }
  };

  return (
    <div className="rounded-md">
      <div className="container mx-auto justify-items-center">
        <div
          className=" bg-gradient-to-b from-gray-900 to-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700 w-full mt-16 sm:mt-24 md:mt-32
                sm:w-10/12 
                md:w-8/12 
                lg:w-6/12 
                xl:w-4/12"
        >
          <div className="flex items-center gap-3 justify-center md:justify-start md:ml-28 mb-10">
            <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Login</h1>
          </div>
          <div className="flex gap-1 items-center">
            <div className="justify-items-center w-full">
              <form onSubmit={handeleSubmit} className="w-full">
                <div className="px-4 p-2">
                  <h1 className="text-white text-lg">Email</h1>
                  <input
                    className="border w-full border-gray-700 rounded-xl p-3 hover:border-gray-500 transition-colors text-white"
                    onChange={handleOnChange}
                    name="email"
                    type="text"
                  />
                </div>
                <div className="px-4 p-2">
                  <h1 className="text-white text-lg">Password</h1>
                  <input
                    className="border w-full border-gray-700 rounded-xl p-3 hover:border-gray-500 transition-colors text-white"
                    onChange={handleOnChange}
                    name="password"
                    type="password"
                  />
                </div>
                <div className="p-4">
                  <button className="py-2 px-8 rounded-xl bg-white text-gray-950 shadow-xl hover:bg-gray-100 font-semibold tracking-tight">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
