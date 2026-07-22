"use client";
import React, { useState } from "react";
import axios from "@/lib/axios";
import { showToast } from "nextjs-toast-notify";

const Register = () => {
  //javascript
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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
    if (form.password !== form.confirmPassword) {
      return alert("Confirm Password is not match!!");
    }
    console.log(form);
    //send to back
    try {
      const res = await axios.post("/api/register", form);
      console.log(res.data);
      showToast.success(res.data);
    } catch (error) {
      const errMsg = error.response?.data?.message;
      showToast.error(errMsg);
      console.log(error);
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
          <h1 className="font-bold text-2xl text-center">Register</h1>
          <div className="flex gap-1 items-center">
            <div className="justify-items-center">
              <form onSubmit={handeleSubmit}>
                <div className="px-4 p-2">
                  <h1 className="text-lg">Email</h1>
                  <input
                    className="border rounded-md w-full sm:w-64 md:w-80 lg:w-96 p-2 "
                    onChange={handleOnChange}
                    name="email"
                    type="text"
                  />
                </div>
                <div className="px-4 p-2">
                  <h1 className="text-lg">Password</h1>
                  <input
                    className="border rounded-md w-full sm:w-64 md:w-80 lg:w-96 p-2"
                    onChange={handleOnChange}
                    name="password"
                    type="password"
                  />
                </div>
                <div className="px-4 p-2">
                  <h1 className="text-lg">Confirm Password</h1>
                  <input
                    className="border rounded-md w-full sm:w-64 md:w-80 lg:w-96 p-2"
                    onChange={handleOnChange}
                    name="confirmPassword"
                    type="password"
                  />
                </div>
                <div className="p-2">
                  <button className="p-2 rounded-md bg-gray-700 text-white shadow-md  hover:bg-gray-900 font-semibold">
                    Register
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

export default Register;
