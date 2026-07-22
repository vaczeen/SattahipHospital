"use client";
import React from "react";
import { createPortal } from "react-dom";
import "@/app/print.css";
import { dateFormat } from "@/lib/inventory-utils/dateformat";

const PrintReport = ({ data, startDate, endDate, productName }) => {
    if (!data) return null;

    const thaiDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;
    };

    return createPortal(
        <div className="print-area p-8">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold">
                    รายงานการเคลื่อนไหว พัสดุคอมพิวเตอร์
                    {startDate && endDate ? ` ตั้งแต่วันที่ ${thaiDate(startDate)} ถึงวันที่ ${thaiDate(endDate)}` : " ทั้งหมด"}
                </h2>
                {productName !== "ALL" && (
                    <p className="text-lg font-semibold">พัสดุ: {productName}</p>
                )}
            </div>

            <table className="w-full border-collapse border border-black text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-black p-2 text-center w-[20%] font-bold">ครุภัณฑ์</th>
                        <th className="border border-black p-2 text-center w-[15%] font-bold">สถานะ</th>
                        <th className="border border-black p-2 text-center w-[15%] font-bold">วันที่</th>
                        <th className="border border-black p-2 text-center w-[25%] font-bold">รับจาก/จ่ายให้</th>
                        <th className="border border-black p-2 text-center w-[10%] font-bold">จำนวน</th>
                        <th className="border border-black p-2 text-center w-[15%] font-bold">คงเหลือ</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="h-8">
                            <td className="border border-black px-2 py-1 leading-tight">{item.productName}</td>
                            <td className="border border-black px-2 py-1 text-center">{item.status}</td>
                            <td className="border border-black px-2 py-1 text-center">{thaiDate(item.date)}</td>
                            <td className="border border-black px-2 py-1 leading-tight">{item.fromTo || "-"}</td>
                            <td className="border border-black px-2 py-1 text-center font-bold">
                                {item.type === "IN" ? "+" : "-"}{item.quantity}
                            </td>
                            <td className="border border-black px-2 py-1 text-center font-bold">{item.balance}</td>
                        </tr>
                    ))}
                    {/* Fill empty rows if data is small? (Optional, following PrintOrder pattern) */}
                </tbody>
            </table>

            {/* <div className="mt-8 flex justify-between text-center">
                <div className="w-1/3">
                    <p className="mb-8">ลงชื่อ................................................ผู้เบิก</p>
                    <p>(................................................)</p>
                </div>
                <div className="w-1/3">
                    <p className="mb-8">ลงชื่อ................................................ผู้จ่าย</p>
                    <p>(................................................)</p>
                </div>
            </div> */}
        </div>,
        document.body
    );
};

export default PrintReport;

