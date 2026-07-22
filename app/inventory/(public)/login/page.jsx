"use client";
import React, { useState } from "react";
import axios from "@/lib/axios";
import { showToast } from "nextjs-toast-notify";
import useEcomStore from "@/store/ecom-store";
import { useRouter } from "next/navigation";

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
    <div className="bg-gray-100 rounded-md py-52 ">
      <div className="container mx-auto p-20 justify-items-center">
        <div className="bg-white shadow-md rounded-md p-3 w-full 
                sm:w-10/12 
                md:w-8/12 
                lg:w-6/12 
                xl:w-4/12">
          <h1 className="font-bold text-2xl text-center">Login</h1>
          <div className="flex gap-1 items-center">
            <div className="justify-items-center">
              <form onSubmit={handeleSubmit}>
                <div className="px-4 p-2">
                  <h1 className="text-lg">Email</h1>
                  <input
                    className="border rounded-md w-full sm:w-64 md:w-80 lg:w-96 p-2  "
                    onChange={handleOnChange}
                    name="email"
                    type="text"
                  />
                </div>
                <div className="px-4 p-2">
                  <h1 className="text-lg">Password</h1>
                  <input
                    className="border rounded-md w-full sm:w-64 md:w-80 lg:w-96 p-2 "
                    onChange={handleOnChange}
                    name="password"
                    type="password"
                  />
                </div>
                <div className="p-2">
                  <button className="p-2 rounded-md bg-gray-700 text-white shadow-md  hover:bg-gray-900 font-semibold">
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
