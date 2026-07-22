"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function AnnouncementPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [noShowToday, setNoShowToday] = useState(false);

  useEffect(() => {
    const lastClosed = localStorage.getItem("announcementClosedDate");
    const today = new Date().toDateString();
    if (lastClosed !== today) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (noShowToday) {
      localStorage.setItem("announcementClosedDate", new Date().toDateString());
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop เบลอหน้าหลัง */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm " />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
        <div
          className="bg-white rounded-xl shadow-2xl w-full overflow-hidden"
          style={{ maxWidth: "900px" }}
        >
          {/* Header */}
          {/* <div className="bg-emerald-800 px-5 py-4 flex items-center gap-2">
            <span className="text-emerald-200 text-lg">📢</span>
            <h2 className="text-emerald-50 font-semibold text-base">ประกาศสำคัญ</h2>
          </div> */}

          {/* Content */}
          <div className="p-5">
            {/* รูปภาพ */}
            <div className="relative w-full rounded-lg overflow-hidden mb-4 bg-gray-100">
              <Image
                src="/RIP.png"
                alt="ประกาศ"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto rounded-lg"
                style={{ width: "100%", height: "auto" }}
              />
            </div>

            {/* ข้อความ */}
            {/* <p className="text-gray-700 text-sm leading-relaxed mb-5">     
              โรงพยาบาลสัตหีบจะปิดให้บริการชั่วคราวในวันที่ 20 กรกฎาคม 2568 
              เพื่อการปรับปรุงระบบ กรุณาติดต่อสอบถามข้อมูลเพิ่มเติมได้ที่ 038-245051
            </p> */}

            {/* Footer */}
            <div className="flex items-center justify-between border-t pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-gray-500 text-sm select-none">
                <input
                  type="checkbox"
                  checked={noShowToday}
                  onChange={(e) => setNoShowToday(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 cursor-pointer"
                />
                ไม่แสดงอีกในวันนี้
              </label>

              <button
                onClick={handleClose}
                className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
