"use client";
import React, { useState, useEffect } from "react";
import { saveOrder, listUserCart } from "@/lib/inventory-api/user";
import useEcomStore from "@/store/ecom-store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const SummaryCard = () => {
  const token = useEcomStore((state) => state.token);
  const clearCart = useEcomStore((state) => state.clearCart);
  const getDepartment = useEcomStore((state) => state.getDepartment);
  const department = useEcomStore((state) => state.department);
  const [products, setProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // const [address, setAddress] = useState("");
  // const [addressSaved, setAddressSaved] = useState(false);

  const router = useRouter();
  // const uniqueDepartment = department.filter(
  //   (item, index, self) => index === self.findIndex((d) => d.dept === item.dept)
  // );

  const uniqueOffice = [...department]
    .sort((a, b) => parseInt(a.deptcode, 10) - parseInt(b.deptcode, 10))
    .filter(
      (item, index, self) =>
        index === self.findIndex((d) => d.office === item.office)
    );

  const handleOfficeChange = (e) => {
    const selectedOffice = e.target.value;

    // หา row ใน DB ที่ office ตรงกับค่าที่เลือก
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

  // const handleOnchange = (e) => {
  //   console.log(e.target.name, e.target.value);
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

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

  // const handleSaveOffice = () => {
  //   if (!department) {
  //     return toast.warning("Please fill data");
  //   }
  //   saveOffice(token, department)
  //     .then((res) => {
  //       console.log(res);
  //       toast.success(res.data.message);
  //       setAddressSaved(true);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };



  useEffect(() => {
    getDepartment();
    handleGetUserCart(token);
  }, []);

  return (
    <div className="mx-auto">
      <div className="flex flex-warp gap-4">
        {/* left */}
        <div className="w-2/4">
          <div className="bg-gray-100 p-4 rounded-md border shadow-md space-y-4">
            <h1 className="text-xl font-bold ">กรุณากรอกข้อมูลให้ครบถ้วน</h1>

            <div className="py-1 ">
              <h1 className="text-lg  ">จากฝ่าย/งาน</h1>
              <select
                className="border rounded-md w-full sm:w-64 md:w-80 lg:w-96 p-2"
                name="office"
                onChange={handleOfficeChange}
                required
                value={form.office}
              >
                <option value="" disabled>
                  Please Select
                </option>
                {uniqueOffice.map((item) => (
                  <option key={item.id} value={item.office}>
                    {item.deptcode} {item.office}
                  </option>
                ))}
              </select>
            </div>

            <h1 className="text-lg">กลุ่มงาน</h1>
            <input
              className="border rounded-md w-full sm:w-64 md:w-80 lg:w-96 p-2"
              value={form.dept}
              readOnly
            ></input>
            <h1 className="text-lg">รหัสแผนงาน</h1>
            <input
              className="border rounded-md w-full sm:w-64 md:w-80 lg:w-96 p-2"
              value={form.deptcode}
              readOnly
            ></input>
            {/* <div className="p-2">
              <button
                className="p-2 rounded-md bg-gray-700 text-white shadow-md  hover:bg-gray-900 font-semibold"
                onClick={handleSaveOffice}
              >
                บันทึก
              </button>
            </div> */}
          </div>
        </div>

        {/* right */}
        <div className="w-2/4">
          <div className="bg-gray-100 p-4 rounded-md border shadow-md space-y-4">
            <h1 className="text-xl font-bold">สรุปรายการที่ขอเบิก</h1>
            {/* itemlist */}
            {products?.map((item, index) => (
              <div key={index} value={index}>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-md font-bold text-blue-500">
                      {item.product.title}
                    </p>

                    {/* <p>จำนวน: {item.count} x {item.product.price}</p> */}
                  </div>

                  <div>
                    <p className="text-md">
                      จำนวน:{" "}
                      <a className="text-red-500 font-bold">{item.count}</a>
                    </p>
                    {/* <p className="text-red-500 font-bold">200</p> */}
                    {/* <p className="text-red-500 font-bold"> {item.count * item.product.price}</p> */}
                  </div>
                </div>
              </div>
            ))}
            {/* 
            <hr />
            <div>
              <div className="flex justify-between">
                <p>ค่าจัดส่ง</p>
                <p>0.00</p>
              </div>
              <div className="flex justify-between">
                <p>ส่วนลด</p>
                <p>0.00</p>
              </div>
            </div> */}

            {/* ยอดรวม */}
            {/* <hr />
            <div>
              <div className="flex justify-between">
                <p className="font-bold">ยอดรวมสุทธิ:</p>
                <p className="text-red-500 font-bold text-lg">{cartTotal}</p>
              </div>
            </div> */}

            <div>
              <button
                onClick={handleGoToPrint}
                className=" bg-green-600 w-full p-2 rounded-md shadow-md text-white hover:bg-green-700"
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

