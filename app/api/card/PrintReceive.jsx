"use client";
import "@/app/print.css";
import { createPortal } from "react-dom";

const PrintReceive = ({ items }) => {
    if (!items || items.length === 0) return null;

    const today = new Date();

    return createPortal(
        <div className="print-area">
            <h1 className="text-end mb-4">
                ใบเบิกพัสดุ ................/.....
            </h1>

            <br />
            <br />

            <h1 className="text-center">
                ใบเบิกพัสดุ โรงพยาบาลสัตหีบ กม.10
            </h1>
            <p className="text-center">
                วันที่ {today.getDate()} เดือน {today.toLocaleDateString("th-TH", { month: "long" })} พ.ศ. {today.getFullYear() + 543}
            </p>

            <div className="mb-4">
                <p >จากฝ่าย/งาน งานสารสนเทศทางการแพทย์ กลุ่มงานประกันสุขภาพยุทธศาสตร์และสารสนเทศฯ รหัสแผนงาน 10825-2613-30604</p>
                <p>ถึง หัวหน้าเจ้าหน้าที่ โรงพยาบาลสัตหีบ กม.10</p>
                <p className="px-6 ">ข้าพเจ้าขอเบิกพัสดุตามรายการข้างท้ายนี้เพื่อใช้ในงานราชการและต้องการใช้สิ่งของตามใบแนบนี้เพื่อใช้</p>
                <p >ในราชการเท่านั้น</p>
            </div>


            <table className="w-full border border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-800  w-[9%] font-normal" rowSpan={2}>ลำดับ</th>
                        <th className="border border-gray-800  w-auto font-normal" rowSpan={2}>รายการ</th>
                        <th className="border border-gray-800  w-[12%] font-normal" rowSpan={2}>หน่วยนับ</th>
                        <th className="border border-gray-800  w-[20%] font-normal" colSpan={2}>จำนวน</th>
                        <th className="border border-gray-800  w-[10%] font-normal" rowSpan={2}>หมายเหตุ</th>
                    </tr>
                    <tr>
                        <th className="border border-gray-800  font-normal">เบิก</th>
                        <th className="border border-gray-800  font-normal">จ่าย</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} className="h-[20px] leading-none">
                            <td className="border border-gray-800 text-center">{index + 1}</td>
                            <td className="border border-gray-800">
                                {item.productName}
                            </td>
                            <td className="border border-gray-800 text-center">{item.unit}</td>
                            <td className="border border-gray-800 text-center">
                                {item.quantity.toLocaleString()}
                            </td>
                            <td className="border border-gray-800 text-center"></td>
                            <td className="border border-gray-800 text-center"></td>
                        </tr>
                    ))}
                    {/* Fill empty rows to reach at least 10 lines for consistent look */}
                    {Array.from({ length: Math.max(0, 7 - items.length) }).map(
                        (_, index) => (
                            <tr key={`empty-${index}`} className="h-[20px] leading-none">
                                <td className="border border-gray-800 text-center">&nbsp;</td>
                                <td className="border border-gray-800"></td>
                                <td className="border border-gray-800 text-center"></td>
                                <td className="border border-gray-800 text-center"></td>
                                <td className="border border-gray-800 text-center"></td>
                                <td className="border border-gray-800 text-center"></td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
            <br />

            <div className="mt-4 flex justify-between ">
                <div >
                    <p >ลงชื่อ...............................................ผู้เบิกพัสดุ</p>
                    <p className=" px-10">(..........................................)</p>
                    <p className=" ">ตำแหน่ง..............................................</p>
                    <p className=" px-10">............./.........../...........</p>
                </div>
                <div>
                    <p >ลงชื่อ...............................................ผู้จ่ายพัสดุ</p>
                    <p className=" px-10">(นางสาววิสุทธิ์ณี ปิ่นรัตน์)</p>
                    <p className=" px-10">ตำแหน่ง หัวหน้าคลังพัสดุ</p>
                    <p className=" px-12">............./.........../...........</p>
                </div>

            </div>

            <div className="mt-4 flex justify-between ">

                <div >
                    <p >ลงชื่อ...............................................ผู้สั่งจ่ายพัสดุ</p>
                    <p className=" px-14">(นางสมถวิล ทาหอม)</p>
                    <p className=" px-10">ตำแหน่ง หัวหน้าเจ้าหน้าที่</p>
                    <p className=" px-10">............./.........../...........</p>
                </div>

                <div >
                    <p >ลงชื่อ...............................................ผู้รับพัสดุ</p>
                    <p className=" px-9">(..........................................)</p>
                    <p className=" ">ตำแหน่ง..............................................</p>
                    <p className=" px-12">............./.........../...........</p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PrintReceive;

