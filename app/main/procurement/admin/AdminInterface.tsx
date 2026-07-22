"use client";

import { useState, useRef } from "react";
import { createProcurement, deleteProcurement } from "@/lib/actions";
import { Upload, Trash2, Loader2, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

type Procurement = {
    id: number;
    title: string;
    description: string | null;
    fileUrl: string;
    category: string;
    publishedAt: string | Date; // Allow both for flexibility, but we will likely receive string from JSON serialization if passed from server
    createdAt: string | Date;
};

export default function AdminInterface({ initialProcurements }: { initialProcurements: any[] }) {
    // Cast initialProcurements to Procurement[] after ensuring dates are handled if needed, 
    // but simpler to just accept any and let the component handle string/Date
    const [procurements, setProcurements] = useState<Procurement[]>(initialProcurements);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            const result = await createProcurement(formData);
            if (result.success) {
                alert("เพิ่มข้อมูลสำเร็จ");
                formRef.current?.reset();
                window.location.reload(); // Simple reload to refresh data
            } else {
                alert("เกิดข้อผิดพลาด: " + result.error);
            }
        } catch (error) {
            console.error(error);
            alert("เกิดข้อผิดพลาด ขนาดไฟล์ของคุณอาจใหญ่เกิน 10 MB");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number, fileUrl: string) => {
        if (!confirm("ยืนยันการลบข้อมูล?")) return;

        setIsDeleting(id);
        try {
            const result = await deleteProcurement(id, fileUrl);
            if (result.success) {
                setProcurements(prev => prev.filter(p => p.id !== id));
            } else {
                alert("เกิดข้อผิดพลาดในการลบ: " + result.error);
            }
        } catch (error) {
            alert("เกิดข้อผิดพลาดที่ไม่คาดคิด");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Form Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-border/50">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-secondary" />
                    เพิ่มรายการใหม่
                </h2>

                <form ref={formRef} action={handleSubmit} className="space-y-4">
                    {/* Form fields same as before... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">หัวข้อ/เรื่อง</label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                placeholder="ระบุหัวข้อประกาศ..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">หมวดหมู่</label>
                            <select
                                name="category"
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            >
                                <option value="ประกาศจัดซื้อจัดจ้าง">ประกาศจัดซื้อจัดจ้าง</option>
                                <option value="สรุปผลการจัดหาพัสดุ">สรุปผลการจัดหาพัสดุ</option>
                                <option value="ราคากลาง">ราคากลาง</option>
                                <option value="อื่นๆ">อื่นๆ</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">รายละเอียด (ถ้ามี)</label>
                        <textarea
                            name="description"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-24 resize-none"
                            placeholder="รายละเอียดเพิ่มเติม..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">วันที่ประกาศ</label>
                            <input
                                type="date"
                                name="date"
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">ไฟล์เอกสาร (PDF/Image)</label>
                            <input
                                type="file"
                                name="file"
                                required
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                กำลังบันทึก...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                บันทึกข้อมูล
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* List Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-border/50">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-secondary" />
                    รายการทั้งหมด ({procurements.length})
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 uppercase">
                            <tr>
                                <th className="px-4 py-3">วันที่</th>
                                <th className="px-4 py-3">เรื่อง</th>
                                <th className="px-4 py-3">หมวดหมู่</th>
                                <th className="px-4 py-3 text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {procurements.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                        ไม่มีข้อมูล
                                    </td>
                                </tr>
                            ) : (
                                procurements.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                            {format(new Date(item.publishedAt), "dd/MM/yyyy")}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            <a href={item.fileUrl} target="_blank" className="hover:text-primary hover:underline block truncate max-w-sm">
                                                {item.title}
                                            </a>
                                            {item.description && <p className="text-xs text-muted-foreground truncate max-w-xs">{item.description}</p>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(item.id, item.fileUrl)}
                                                disabled={isDeleting === item.id}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                                                title="ลบข้อมูล"
                                            >
                                                {isDeleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
