"use client";
import React, { useState, useEffect } from "react";
import useEcomStore from "@/store/ecom-store";
import {
  getListAllUser,
  changeUserStatus,
  changeUserRole,
} from "@/lib/inventory-api/admin";
import { UserCog } from "lucide-react";
import { dateFormat } from "@/lib/inventory-utils/dateformat";
import { toast } from "react-toastify";

const UserTable = () => {
  const token = useEcomStore((state) => state.token);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    handlegetUsers(token);
  }, []);

  const handlegetUsers = (token) => {
    getListAllUser(token)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeUserStatus = (userId, userStatus) => {
    console.log(userId, userStatus);
    const value = {
      id: userId,
      enabled: !userStatus,
    };
    changeUserStatus(token, value)
      .then((res) => {
        console.log(res);
        handlegetUsers(token);
        toast.success("Update Status Success!!");
      })
      .catch((err) => console.log(err));
  };

  const handleChangeUserRole = (userId, userRole) => {
    // console.log(userId, userStatus);
    const value = {
      id: userId,
      role: userRole,
    };
    changeUserRole(token, value)
      .then((res) => {
        console.log(res);
        handlegetUsers(token);
        toast.success("Update Role Success!!");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="bg-gray-800 shadow-md rounded-xl p-4">
      <div className="flex items-center justify-between  pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold  flex items-center gap-2 text-white">
           <UserCog className="w-8 h-8 text-blue-600" /> Manage Users
          </h2>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-400 dark:text-gray-400">
          <thead className="text-xs text-gray-400  dark:text-gray-400 uppercase bg-gray-700 dark:bg-gray-700 ">
            <tr className="text-center">
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium  uppercase tracking-wider"
              >
                ลำดับ
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium  uppercase tracking-wider"
              >
                Username
              </th>
              <th
                scope="col"
                className="px-12 py-3 text-left text-xs font-medium  uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
              >
                Action
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider"
              >
                UpdadeAt
              </th>
            </tr>
          </thead>

          <tbody>
            {users?.map((el, i) => (
              <tr
                key={el.id}
                className="bg-gray-800 border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {i + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {el.email}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-white">
                  <select
                    onChange={(e) =>
                      handleChangeUserRole(el.id, e.target.value)
                    }
                    value={el.role}
                    className="bg-gray-200 border border-gray-600 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option>user</option>
                    <option>admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${el.enabled ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {el.enabled ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <button
                    className={`p-1 rounded-md shadow-md ${el.enabled ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
                    onClick={() => handleChangeUserStatus(el.id, el.enabled)}
                  >
                    {el.enabled ? "Disable" : "Enable"}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {dateFormat(el.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
