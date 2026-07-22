"use client";

import { useState, useMemo, useRef, useTransition } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  FileText,
  Download,
  Calendar,
  Lock,
  Settings,
  ChevronDown,
  ChevronUp,
  Trash2,
  Upload,
  X,
  Plus,
  CheckCircle,
  AlertCircle,
  Shield,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createPolicyDocument,
  deletePolicyDocument,
} from "@/lib/policy-actions";

const ADMIN_PASSWORD = "admin";

const CATEGORIES = [
  "ทั่วไป",
  "นโยบายโรงพยาบาล",
  "ประกาศกระทรวง",
  "แนวทางปฏิบัติ",
  "กฎระเบียบ",
  "อื่นๆ",
];

type PolicyDoc = {
  id: number;
  title: string;
  description: string | null;
  fileUrl: string;
  category: string;
  publishedAt: string | Date;
  createdAt: string | Date;
};

const CATEGORY_COLORS: Record<string, string> = {
  นโยบายโรงพยาบาล: "bg-blue-50 text-blue-700 border-blue-200",
  ประกาศกระทรวง: "bg-purple-50 text-purple-700 border-purple-200",
  แนวทางปฏิบัติ: "bg-emerald-50 text-emerald-700 border-emerald-200",
  กฎระเบียบ: "bg-red-50 text-red-700 border-red-200",
  ทั่วไป: "bg-gray-50 text-gray-700 border-gray-200",
  อื่นๆ: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export default function PolicyClient({ docs }: { docs: PolicyDoc[] }) {
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // Upload form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadCategory, setUploadCategory] = useState("ทั่วไป");
  const [uploadDate, setUploadDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<PolicyDoc | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePasswordError, setDeletePasswordError] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [openYears, setOpenYears] = useState<number[]>([]);

  // Group by Buddhist year
  const grouped = useMemo(() => {
    const groups: Record<number, PolicyDoc[]> = {};
    docs.forEach((doc) => {
      const date = new Date(doc.publishedAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const fiscalYear = month >= 10 ? year + 1 : year;
      const buddhistYear = fiscalYear + 543;
      if (!groups[buddhistYear]) groups[buddhistYear] = [];
      groups[buddhistYear].push(doc);
    });
    const result = Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, items]) => ({
        year: Number(year),
        items: items.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        ),
      }));

    // Auto-open latest year
    if (result.length > 0 && openYears.length === 0) {
      setOpenYears([result[0].year]);
    }
    return result;
  }, [docs]);

  const toggleYear = (year: number) =>
    setOpenYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );

  // Password unlock
  const handleUnlock = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowPasswordModal(false);
      setAdminPassword("");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setAdminPassword("");
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  // Upload submit
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError("กรุณาเลือกไฟล์");
      return;
    }
    setUploadStatus("idle");
    setUploadError("");

    const formData = new FormData();
    formData.append("title", uploadTitle);
    formData.append("description", uploadDescription);
    formData.append("category", uploadCategory);
    formData.append("date", uploadDate);
    formData.append("file", uploadFile);

    startTransition(async () => {
      const result = await createPolicyDocument(formData);
      if (result.success) {
        setUploadStatus("success");
        setUploadTitle("");
        setUploadDescription("");
        setUploadCategory("ทั่วไป");
        setUploadDate(new Date().toISOString().split("T")[0]);
        setUploadFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => {
          setUploadStatus("idle");
          setShowUploadForm(false);
        }, 1500);
      } else {
        setUploadStatus("error");
        setUploadError(result.error || "เกิดข้อผิดพลาด");
      }
    });
  };

  // Delete confirm
  const handleDeleteConfirm = () => {
    if (deletePassword !== ADMIN_PASSWORD) {
      setDeletePasswordError(true);
      setDeletePassword("");
      setTimeout(() => setDeletePasswordError(false), 2000);
      return;
    }
    if (!deleteTarget) return;
    startTransition(async () => {
      await deletePolicyDocument(deleteTarget.id, deleteTarget.fileUrl);
      setDeleteTarget(null);
      setDeletePassword("");
    });
  };

  return (
    <div className="space-y-6">
      {/* Admin Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>{docs.length} เอกสาร</span>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <button
                onClick={() => setShowUploadForm((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium bg-emerald-700 text-white rounded-lg px-4 py-2 hover:bg-emerald-800 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                เพิ่มเอกสาร
              </button>
              <button
                onClick={() => setIsAdmin(false)}
                className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-lg px-3 py-2 hover:bg-gray-50 transition-all"
              >
                <X className="w-4 h-4" />
                ออกจากโหมดแก้ไข
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-700 border border-border rounded-lg px-4 py-2 hover:border-emerald-700 hover:bg-primary/5 transition-all"
            >
              <Settings className="w-4 h-4" />
              ลงข้อมูล (สำหรับเจ้าหน้าที่)
            </button>
          )}
        </div>
      </div>

      {/* Upload Form */}
      {isAdmin && showUploadForm && (
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="w-5 h-5 text-emerald-700" />
            <h3 className="font-semibold text-gray-800">เพิ่มเอกสารใหม่</h3>
          </div>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อเอกสาร <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="ระบุชื่อเอกสาร..."
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  วันที่ประกาศ <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รายละเอียด (ถ้ามี)
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="รายละเอียดเพิ่มเติม..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ไฟล์เอกสาร <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
                    uploadFile
                      ? "border-primary/50 bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-gray-50",
                  )}
                >
                  {uploadFile ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm font-medium truncate max-w-xs">
                        {uploadFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadFile(null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        คลิกเพื่อเลือกไฟล์ หรือลากวางที่นี่
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        PDF, DOC, DOCX, XLS, XLSX (สูงสุด 50MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>

            {uploadStatus === "success" && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-lg text-sm">
                <CheckCircle className="w-4 h-4" />
                อัพโหลดเอกสารสำเร็จ!
              </div>
            )}
            {uploadStatus === "error" && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2.5 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4" />
                {uploadError}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowUploadForm(false);
                  setUploadStatus("idle");
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-emerald-700 text-white rounded-lg text-sm font-bold hover:bg-emerald-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {isPending ? "กำลังอัพโหลด..." : "บันทึกเอกสาร"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 space-y-5">
            <div className="text-center space-y-2">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                ยืนยันตัวตนเจ้าหน้าที่
              </h3>
              <p className="text-sm text-gray-500">
                ใส่รหัสผ่านเพื่อเข้าสู่โหมดจัดการเอกสาร
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                placeholder="รหัสผ่าน..."
                autoFocus
                className={cn(
                  "w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all",
                  passwordError
                    ? "border-red-400 bg-red-50 placeholder-red-300 animate-pulse"
                    : "border-border focus:border-emerald-700 focus:ring-2 focus:ring-primary/20",
                )}
              />
              {passwordError && (
                <p className="text-red-500 text-xs text-center">
                  รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setAdminPassword("");
                  setPasswordError(false);
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleUnlock}
                className="flex-1 px-4 py-2.5 bg-emerald-700 text-white rounded-lg text-sm font-bold hover:bg-emerald-800 transition-colors"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 space-y-5">
            <div className="text-center space-y-2">
              <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                ยืนยันการลบเอกสาร
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                <span className="font-medium text-gray-700">
                  {deleteTarget.title}
                </span>
              </p>
              <p className="text-xs text-gray-400">
                กรุณาใส่รหัสผ่านเพื่อยืนยันการลบ
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDeleteConfirm()}
                placeholder="รหัสผ่าน..."
                autoFocus
                className={cn(
                  "w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-all",
                  deletePasswordError
                    ? "border-red-400 bg-red-50 placeholder-red-300 animate-pulse"
                    : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20",
                )}
              />
              {deletePasswordError && (
                <p className="text-red-500 text-xs text-center">
                  รหัสผ่านไม่ถูกต้อง
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteTarget(null);
                  setDeletePassword("");
                  setDeletePasswordError(false);
                }}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {isPending ? "กำลังลบ..." : "ยืนยันลบ"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document List */}
      {grouped.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
          <FileText className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-medium text-muted-foreground">
            ยังไม่มีเอกสาร
          </h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {isAdmin
              ? 'คลิก "เพิ่มเอกสาร" เพื่อเริ่มต้นเพิ่มเอกสาร'
              : "ไม่พบเอกสารในระบบ"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => (
            <div
              key={group.year}
              className="border border-border/50 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => toggleYear(group.year)}
                className="w-full flex items-center justify-between p-5 bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  ปีงบประมาณ {group.year}
                  <span className="text-sm font-normal text-primary/60 ml-1">
                    ({group.items.length} รายการ)
                  </span>
                </h3>
                {openYears.includes(group.year) ? (
                  <ChevronUp className="w-5 h-5 text-primary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary" />
                )}
              </button>

              <div
                className={cn(
                  "transition-all duration-300 ease-in-out",
                  openYears.includes(group.year)
                    ? "max-h-[3000px] opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden",
                )}
              >
                <div className="divide-y divide-gray-100">
                  {group.items.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 hover:bg-gray-50 flex flex-col md:flex-row gap-4 items-start md:items-center group/item transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                              CATEGORY_COLORS[doc.category] ??
                                "bg-gray-50 text-gray-700 border-gray-200",
                            )}
                          >
                            {doc.category}
                          </span>
                          <span className="text-xs text-muted-foreground/70">
                            {format(new Date(doc.publishedAt), "d MMM yyyy", {
                              locale: th,
                            })}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 leading-snug">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary hover:underline transition-colors"
                          >
                            {doc.title}
                          </a>
                        </h4>
                        {doc.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-800 hover:text-white hover:border-emerald-700 transition-all shadow-sm whitespace-nowrap"
                        >
                          <Download className="w-4 h-4" />
                          ดาวน์โหลด
                        </a>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteTarget(doc)}
                            className="p-2 rounded-lg border border-border text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
                            title="ลบเอกสาร"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin badge */}
      {isAdmin && (
        <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 bg-primary/5 border border-primary/20 rounded-full px-4 py-2 w-fit mx-auto">
          <Shield className="w-3.5 h-3.5" />
          โหมดจัดการเอกสาร (เจ้าหน้าที่)
        </div>
      )}
    </div>
  );
}
