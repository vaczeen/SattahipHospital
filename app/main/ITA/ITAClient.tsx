"use client";

import { useState, useRef, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Download,
  Lock,
  Settings,
  ChevronDown,
  ChevronRight,
  Trash2,
  Upload,
  X,
  Plus,
  CheckCircle,
  Shield,
  Edit3,
  FolderTree,
  Paperclip,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createITAItem,
  deleteITAItem,
  updateITAItem,
  type ITAItemData,
} from "@/lib/ita-actions";

const ADMIN_PASSWORD = "admin";

const LEVEL_LABELS = [
  "หัวข้อใหญ่",
  "หัวข้อย่อย",
  "หัวข้อย่อย 2",
  "หัวข้อย่อย 3",
  "หัวข้อย่อย 4",
  "หัวข้อย่อย 5",
  "หัวข้อย่อย 6",
];

// Pre-defined Tailwind classes for each level (can't use dynamic string interpolation with Tailwind)
const LEVEL_NODE_CLASSES = [
  "border-purple-200 bg-white hover:shadow-sm",
  "border-blue-200 bg-blue-50/40 hover:bg-blue-50/70",
  "border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70",
  "border-amber-200 bg-amber-50/40 hover:bg-amber-50/70",
  "border-pink-200 bg-pink-50/40 hover:bg-pink-50/70",
  "border-cyan-200 bg-cyan-50/40 hover:bg-cyan-50/70",
  "border-rose-200 bg-rose-50/40 hover:bg-rose-50/70",
];

const LEVEL_BADGE_CLASSES = [
  "bg-purple-50 border-purple-200 text-purple-800",
  "bg-blue-50 border-blue-200 text-blue-800",
  "bg-emerald-50 border-emerald-200 text-emerald-800",
  "bg-amber-50 border-amber-200 text-amber-800",
  "bg-pink-50 border-pink-200 text-pink-800",
  "bg-cyan-50 border-cyan-200 text-cyan-800",
  "bg-rose-50 border-rose-200 text-rose-800",
];

const LEVEL_DOT_CLASSES = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-rose-500",
];

const LEVEL_LINE_CLASSES = [
  "bg-purple-200",
  "bg-blue-200",
  "bg-emerald-200",
  "bg-amber-200",
  "bg-pink-200",
  "bg-cyan-200",
  "bg-rose-200",
];

// Indent margin classes per level
const LEVEL_INDENT_CLASSES = [
  "",
  "ml-6",
  "ml-12",
  "ml-16",
  "ml-20",
  "ml-24",
  "ml-28",
];

function getLevelClass(classes: string[], level: number): string {
  return classes[level] ?? classes[classes.length - 1];
}

// Fiscal year date range helper: Year Y = 1 ต.ค. (Y-1) - 30 ก.ย. Y
function getFiscalYearRange(year: number): string {
  return `1 ต.ค. ${year - 1} - 30 ก.ย. ${year}`;
}

function formatThaiDate(date: Date | string): string {
  const d = new Date(date);
  const day = d.getDate();
  const monthNames = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear() + 543; // Buddhist Era
  return `${day} ${month} ${year}`;
}

// ─── Inline Item Form ────────────────────────────────────────────
function ItemForm({
  itemId,
  level,
  parentId,
  initialTitle,
  initialDescription,
  initialFileUrl,
  onSubmit,
  onCancel,
  isEditing,
  isPending,
}: {
  itemId?: number | null;
  level: number;
  parentId: number | null;
  initialTitle?: string;
  initialDescription?: string;
  initialFileUrl?: string | null;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
  isPending: boolean;
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [file, setFile] = useState<File | null>(null);
  const [removeFile, setRemoveFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const fd = new FormData();
    if (isEditing && itemId != null) fd.append("id", itemId.toString());
    fd.append("title", title.trim());
    fd.append("description", description.trim());
    fd.append("level", level.toString());
    if (parentId !== null) fd.append("parentId", parentId.toString());
    if (file) fd.append("file", file);
    if (isEditing && initialFileUrl) {
      if (removeFile && !file) {
        fd.append("existingFileUrl", "");
      } else if (!file) {
        fd.append("existingFileUrl", initialFileUrl);
      }
    }
    onSubmit(fd);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-xl border-2 border-dashed p-4 space-y-3",
        getLevelClass(LEVEL_INDENT_CLASSES, level),
        isEditing
          ? "border-amber-300 bg-amber-50/50"
          : "border-purple-300 bg-purple-50/50",
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-[10px] border",
            getLevelClass(LEVEL_BADGE_CLASSES, level),
          )}
        >
          {getLevelClass(LEVEL_LABELS, level)}
        </span>
        {isEditing ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}
      </div>

      <input
        type="text"
        required
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="ชื่อหัวข้อ..."
        className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="รายละเอียด (ถ้ามี)..."
        rows={2}
        className="w-full px-3 py-2 border border-border rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none bg-white"
      />

      {/* File upload */}
      <div className="space-y-1">
        {isEditing && initialFileUrl && !removeFile && !file && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
            <Paperclip className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">
              {initialFileUrl.split("/").pop()}
            </span>
            <a
              href={initialFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-xs shrink-0"
            >
              ดูไฟล์
            </a>
            <button
              type="button"
              onClick={() => setRemoveFile(true)}
              className="text-red-400 hover:text-red-600 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {(removeFile || !initialFileUrl || file) && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-full border border-dashed rounded-lg p-3 text-center cursor-pointer transition-all",
              file
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 hover:border-purple-400 hover:bg-gray-50",
            )}
          >
            {file ? (
              <div className="flex items-center justify-center gap-2 text-blue-600 text-sm">
                <FileText className="w-4 h-4" />
                <span className="truncate max-w-[200px]">{file.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-5 h-5 text-gray-400 mx-auto" />
                <p className="text-xs text-muted-foreground">
                  คลิกเพื่อแนบไฟล์ (PDF, DOC, DOCX)
                </p>
              </div>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null);
            setRemoveFile(false);
          }}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-3 py-2 border border-border rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={isPending || !title.trim()}
          className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg text-xs font-bold hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {isPending ? (
            <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5" />
          )}
          {isPending ? "กำลังบันทึก..." : isEditing ? "บันทึก" : "เพิ่ม"}
        </button>
      </div>
    </form>
  );
}

// ─── Single Tree Node ────────────────────────────────────────────
function TreeNode({
  item,
  level,
  isAdmin,
  isPending,
  onDelete,
  onStartEdit,
  editingId,
  editingLevel,
  editingParentId,
  editTitle,
  editDescription,
  editFileUrl,
  editSubmitting,
  onSubmitEdit,
  onCancelEdit,
  onStartAddChild,
  addingToId,
  addingLevel,
  addSubmitting,
  onSubmitAdd,
  onCancelAdd,
}: {
  item: ITAItemData;
  level: number;
  isAdmin: boolean;
  isPending: boolean;
  onDelete: (item: ITAItemData) => void;
  onStartEdit: (item: ITAItemData) => void;
  editingId: number | null;
  editingLevel: number;
  editingParentId: number | null;
  editTitle: string;
  editDescription: string;
  editFileUrl: string | null;
  editSubmitting: boolean;
  onSubmitEdit: (fd: FormData) => void;
  onCancelEdit: () => void;
  onStartAddChild: (parentId: number, childLevel: number) => void;
  addingToId: number | null;
  addingLevel: number;
  addSubmitting: boolean;
  onSubmitAdd: (fd: FormData) => void;
  onCancelAdd: () => void;
}) {
  const [expanded, setExpanded] = useState(level === 0);
  const hasChildren = item.children && item.children.length > 0;
  const isEditing = editingId === item.id;
  const isAddingChild = addingToId === item.id;
  const canAddChild = level < 6 && isAdmin;

  if (isEditing) {
    return (
      <ItemForm
        itemId={editingId}
        level={editingLevel}
        parentId={editingParentId}
        initialTitle={editTitle}
        initialDescription={editDescription}
        initialFileUrl={editFileUrl}
        onSubmit={onSubmitEdit}
        onCancel={onCancelEdit}
        isEditing
        isPending={editSubmitting}
      />
    );
  }

  return (
    <div className={getLevelClass(LEVEL_INDENT_CLASSES, level)}>
      <div
        className={cn(
          "group flex items-start gap-3 p-3 rounded-xl border transition-all",
          getLevelClass(LEVEL_NODE_CLASSES, level),
        )}
      >
        {/* Expand/collapse button */}
        {hasChildren ? (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-0.5 p-0.5 rounded hover:bg-black/5 transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        ) : (
          <div
            className={cn(
              "w-5 h-5 mt-0.5 rounded-full flex items-center justify-center shrink-0",
              getLevelClass(LEVEL_DOT_CLASSES, level),
            )}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border",
                getLevelClass(LEVEL_BADGE_CLASSES, level),
              )}
            >
              {getLevelClass(LEVEL_LABELS, level)}
            </span>
            {hasChildren && (
              <span className="text-[10px] text-muted-foreground">
                ({item.children.length} รายการย่อย)
              </span>
            )}
          </div>
          <h4
            className={cn(
              "font-semibold mt-1 leading-snug",
              level <= 1 ? "text-base" : "text-sm",
            )}
          >
            {item.title}
          </h4>
          {/* Show modify date on level 0 items when updatedAt differs from createdAt */}
          {level === 0 && item.updatedAt && item.createdAt && (
            new Date(item.updatedAt).getTime() - new Date(item.createdAt).getTime() > 60000
          ) && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                <Edit3 className="w-2.5 h-2.5" />
                แก้ไขล่าสุด: {formatThaiDate(item.updatedAt)}
              </span>
            </div>
          )}
          {item.description && (
            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
          )}
          {item.fileUrl && (
            <div className="flex items-center gap-2 mt-2">
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                <Paperclip className="w-3 h-3" />
                {item.fileUrl.split("/").pop()}
              </a>
              <a
                href={item.fileUrl}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-all"
              >
                <Download className="w-3 h-3" />
                ดาวน์โหลด
              </a>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {isAdmin && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {canAddChild && (
              <button
                onClick={() => onStartAddChild(item.id, level + 1)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all"
                title="เพิ่มหัวข้อย่อย"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onStartEdit(item)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
              title="แก้ไข"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
              title="ลบ"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Inline add child form */}
      {isAddingChild && (
        <div className="mt-2">
          <ItemForm
            level={addingLevel}
            parentId={item.id}
            onSubmit={onSubmitAdd}
            onCancel={onCancelAdd}
            isPending={addSubmitting}
          />
        </div>
      )}

      {/* Children */}
      {hasChildren && expanded && (
        <div className="mt-2 space-y-2 relative">
          <div
            className={cn(
              "absolute left-3 top-0 bottom-0 w-px",
              getLevelClass(LEVEL_LINE_CLASSES, level),
            )}
          />
          {item.children.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              isAdmin={isAdmin}
              isPending={isPending}
              onDelete={onDelete}
              onStartEdit={onStartEdit}
              editingId={editingId}
              editingLevel={editingLevel}
              editingParentId={editingParentId}
              editTitle={editTitle}
              editDescription={editDescription}
              editFileUrl={editFileUrl}
              editSubmitting={editSubmitting}
              onSubmitEdit={onSubmitEdit}
              onCancelEdit={onCancelEdit}
              onStartAddChild={onStartAddChild}
              addingToId={addingToId}
              addingLevel={addingLevel}
              addSubmitting={addSubmitting}
              onSubmitAdd={onSubmitAdd}
              onCancelAdd={onCancelAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Client Component ───────────────────────────────────────
export default function ITAClient({
  items,
  availableYears = [],
  selectedYear = 0,
}: {
  items: ITAItemData[];
  availableYears?: number[];
  selectedYear?: number;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Year tabs
  const currentYear = new Date().getFullYear();
  const allYears = [
    ...new Set([currentYear, ...availableYears]),
  ].sort((a, b) => b - a);
  const activeYear = selectedYear > 0 ? selectedYear : currentYear;

  // ── Delete state ──
  const [deleteTarget, setDeleteTarget] = useState<ITAItemData | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletePasswordError, setDeletePasswordError] = useState(false);

  // ── Edit state ──
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingLevel, setEditingLevel] = useState(0);
  const [editingParentId, setEditingParentId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFileUrl, setEditFileUrl] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // ── Add child state ──
  const [addingToId, setAddingToId] = useState<number | null>(null);
  const [addingLevel, setAddingLevel] = useState(0);
  const [addSubmitting, setAddSubmitting] = useState(false);

  // ── Add root ──
  const [showRootForm, setShowRootForm] = useState(false);
  const [activeYearFilter, setActiveYearFilter] = useState(selectedYear > 0 ? selectedYear : 0);

  // Count all items recursively
  const countItems = useCallback((list: ITAItemData[]): number => {
    return list.reduce(
      (sum, item) => sum + 1 + (item.children ? countItems(item.children) : 0),
      0,
    );
  }, []);
  const totalCount = countItems(items);

  // ── Auth ──
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

  // ── Add root item ──
  const router = useRouter();

  const handleYearChange = (year: number) => {
    setActiveYearFilter(year);
    const params = year > 0 ? `?year=${year}` : "";
    router.push(`/main/ITA${params}`);
  };

  const handleAddRoot = (fd: FormData) => {
    fd.append("year", activeYearFilter.toString());
    setAddSubmitting(true);
    startTransition(async () => {
      const result = await createITAItem(fd);
      if (result.success) {
        setShowRootForm(false);
      }
      setAddSubmitting(false);
      setAddingToId(null);
    });
  };

  // ── Add child item ──
  const handleStartAddChild = (parentId: number, childLevel: number) => {
    setAddingToId(parentId);
    setAddingLevel(childLevel);
  };

  const handleAddChild = (fd: FormData) => {
    fd.append("year", activeYearFilter.toString());
    setAddSubmitting(true);
    startTransition(async () => {
      await createITAItem(fd);
      setAddSubmitting(false);
      setAddingToId(null);
    });
  };

  // ── Edit ──
  const handleStartEdit = (item: ITAItemData) => {
    setEditingId(item.id);
    setEditingLevel(item.level);
    setEditingParentId(item.parentId);
    setEditTitle(item.title);
    setEditDescription(item.description || "");
    setEditFileUrl(item.fileUrl);
  };

  const handleEditSubmit = (fd: FormData) => {
    setEditSubmitting(true);
    startTransition(async () => {
      await updateITAItem(fd);
      setEditSubmitting(false);
      setEditingId(null);
    });
  };

  // ── Delete ──
  const handleDeleteConfirm = () => {
    if (deletePassword !== ADMIN_PASSWORD) {
      setDeletePasswordError(true);
      setDeletePassword("");
      setTimeout(() => setDeletePasswordError(false), 2000);
      return;
    }
    if (!deleteTarget) return;
    startTransition(async () => {
      await deleteITAItem(deleteTarget.id);
      setDeleteTarget(null);
      setDeletePassword("");
    });
  };

  return (
    <div className="space-y-6">
      {/* Admin Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FolderTree className="w-4 h-4" />
          <span>{totalCount} รายการ</span>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <>
              <button
                onClick={() => setShowRootForm((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium bg-purple-500 text-white rounded-lg px-4 py-2 hover:bg-purple-600 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                เพิ่มหัวข้อใหญ่
              </button>
              <button
                onClick={() => {
                  setIsAdmin(false);
                  setShowRootForm(false);
                  setEditingId(null);
                  setAddingToId(null);
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-lg px-3 py-2 hover:bg-gray-50 transition-all"
              >
                <X className="w-4 h-4" />
                ออกจากโหมดแก้ไข
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 text-sm text-purple-500 hover:text-purple-700 border border-border rounded-lg px-4 py-2 hover:border-purple-700 hover:bg-white transition-all"
            >
              <Settings className="w-4 h-4" />
              ลงข้อมูล (สำหรับเจ้าหน้าที่)
            </button>
          )}
        </div>
      </div>

      {/* Year Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-medium text-muted-foreground shrink-0">
          ปี:
        </span>
        {allYears.map((year) => (
          <button
            key={year}
            onClick={() => handleYearChange(year === currentYear ? 0 : year)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border transition-all shrink-0",
              (year === currentYear && activeYearFilter === 0) ||
                activeYearFilter === year
                ? "bg-purple-500 text-white border-purple-500 shadow-sm"
                : "bg-white text-gray-600 border-border hover:border-purple-300 hover:bg-purple-50",
            )}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span>{year === currentYear ? `ปัจจุบัน (${year})` : year}</span>
              <span className="text-[10px] opacity-70 font-normal">
                {getFiscalYearRange(year)}
              </span>
            </div>
          </button>
        ))}
        {allYears.length === 0 && (
          <span className="text-sm text-muted-foreground">
            ยังไม่มีข้อมูล
          </span>
        )}
      </div>

      {/* Inline root add form */}
      {isAdmin && showRootForm && (
        <ItemForm
          level={0}
          parentId={null}
          onSubmit={handleAddRoot}
          onCancel={() => setShowRootForm(false)}
          isPending={addSubmitting}
        />
      )}

      {/* Tree */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border">
          <FolderTree className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-medium text-muted-foreground">
            ยังไม่มีข้อมูล ITA
          </h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {isAdmin
              ? 'คลิก "เพิ่มหัวข้อใหญ่" เพื่อเริ่มต้นลงข้อมูล'
              : "ไม่พบข้อมูลในระบบ"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <TreeNode
              key={item.id}
              item={item}
              level={0}
              isAdmin={isAdmin}
              isPending={isPending}
              onDelete={(i) => setDeleteTarget(i)}
              onStartEdit={handleStartEdit}
              editingId={editingId}
              editingLevel={editingLevel}
              editingParentId={editingParentId}
              editTitle={editTitle}
              editDescription={editDescription}
              editFileUrl={editFileUrl}
              editSubmitting={editSubmitting}
              onSubmitEdit={handleEditSubmit}
              onCancelEdit={() => setEditingId(null)}
              onStartAddChild={handleStartAddChild}
              addingToId={addingToId}
              addingLevel={addingLevel}
              addSubmitting={addSubmitting}
              onSubmitAdd={handleAddChild}
              onCancelAdd={() => setAddingToId(null)}
            />
          ))}
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4 space-y-5">
            <div className="text-center space-y-2">
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">
                ยืนยันตัวตนเจ้าหน้าที่
              </h3>
              <p className="text-sm text-gray-500">
                ใส่รหัสผ่านเพื่อเข้าสู่โหมดจัดการข้อมูล
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
                    : "border-border focus:border-purple-500 focus:ring-2 focus:ring-purple-200",
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
                className="flex-1 px-4 py-2.5 bg-purple-500 text-white rounded-lg text-sm font-bold hover:bg-purple-600 transition-colors"
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
                ยืนยันการลบ
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                <span className="font-medium text-gray-700">
                  {deleteTarget.title}
                </span>
              </p>
              {deleteTarget.children && deleteTarget.children.length > 0 && (
                <p className="text-xs text-red-500">
                  ⚠ จะลบหัวข้อย่อยทั้งหมด ({deleteTarget.children.length}{" "}
                  รายการ) ด้วย
                </p>
              )}
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

      {/* Admin badge */}
      {isAdmin && (
        <div className="flex items-center justify-center gap-2 text-xs text-purple-500 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 w-fit mx-auto">
          <Shield className="w-3.5 h-3.5" />
          โหมดจัดการข้อมูล (เจ้าหน้าที่)
        </div>
      )}
    </div>
  );
}
