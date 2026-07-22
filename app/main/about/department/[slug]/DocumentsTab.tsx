"use client";

import { useState } from "react";
import {
  Lock,
  Unlock,
  Upload,
  FileText,
  Trash2,
  Loader2,
  Download,
} from "lucide-react";
import {
  uploadDepartmentDocument,
  deleteDepartmentDocument,
} from "@/lib/department-actions";
import { DepartmentItem } from "@/lib/departmentsData";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface DocumentsTabProps {
  department: DepartmentItem;
  initialDocuments: any[];
}

export default function DocumentsTab({
  department,
  initialDocuments,
}: DocumentsTabProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleUnlock = () => {
    if (password === department.uploadPassword) {
      setIsUnlocked(true);
    } else {
      alert("รหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("departmentId", department.slug);
    formData.append("password", password);

    try {
      const result = await uploadDepartmentDocument(formData);
      if (result.success) {
        alert("อัปโหลดเอกสารสำเร็จ");
        window.location.reload();
      } else {
        alert("เกิดข้อผิดพลาด: " + result.error);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, fileUrl: string) => {
    if (!confirm("ยืนยันการลบเอกสาร?")) return;

    setIsDeleting(id);
    try {
      const result = await deleteDepartmentDocument(
        id,
        fileUrl,
        department.slug,
      );
      if (result.success) {
        setDocuments((docs) => docs.filter((d) => d.id !== id));
      } else {
        alert("ลบไม่สำเร็จ: " + result.error);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">เอกสารของกลุ่มงาน</h3>
        {!isUnlocked ? (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
          >
            {showUploadForm ? "ยกเลิก" : "อัปโหลดเอกสาร (สำหรับเจ้าหน้าที่)"}
          </button>
        ) : (
          <span className="text-sm text-green-600 font-medium flex items-center gap-1">
            <Unlock className="w-4 h-4" /> ปลดล็อกระบบอัปโหลดแล้ว
          </span>
        )}
      </div>

      {showUploadForm && !isUnlocked && (
        <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 max-w-md mx-auto text-center space-y-4">
          <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">
              ใส่รหัสผ่านเพื่อแนบเอกสาร
            </h4>
            <p className="text-xs text-slate-500">
              เฉพาะเจ้าหน้าที่ของกลุ่มงาน {department.label}
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน..."
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            />
            <button
              onClick={handleUnlock}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}

      {isUnlocked && (
        <form
          onSubmit={handleUpload}
          className="bg-white p-6 rounded-xl border shadow-sm space-y-4 animate-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                ชื่อเอกสาร/หัวข้อ
              </label>
              <input
                name="title"
                required
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="เช่น แผนการดำเนินงานประจำปี..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                เลือกไฟล์ (PDF/Image)
              </label>
              <input
                name="file"
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              />
            </div>
          </div>
          <button
            disabled={isSubmitting}
            className="w-full md:w-auto bg-primary text-white px-8 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:shadow-md transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> กำลังอัปโหลด...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> เริ่มอัปโหลด
              </>
            )}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>ยังไม่มีเอกสารในหมวดหมู่นี้</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="group bg-white p-4 rounded-xl border hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex gap-3 items-start mb-4">
                <div className="p-2 rounded-lg bg-red-50 text-red-500">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4
                    className="font-semibold text-gray-800 text-sm line-clamp-2"
                    title={doc.title}
                  >
                    {doc.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1">
                    อัปโหลดเมื่อ{" "}
                    {format(new Date(doc.uploadedAt), "d MMM yyyy", {
                      locale: th,
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/70 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> ดูเอกสาร
                </a>

                {isUnlocked && (
                  <button
                    onClick={() => handleDelete(doc.id, doc.fileUrl)}
                    disabled={isDeleting === doc.id}
                    className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    {isDeleting === doc.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
