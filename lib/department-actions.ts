"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { cwd } from "process";
import { departmentsData } from "./departmentsData";

export async function getDepartmentDocuments(departmentId: string) {
  try {
    const documents = await prisma.departmentDocument.findMany({
      where: { departmentId },
      orderBy: {
        uploadedAt: "desc",
      },
    });
    return documents;
  } catch (error) {
    console.error(`Failed to fetch documents for ${departmentId}:`, error);
    return [];
  }
}

export async function uploadDepartmentDocument(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const departmentId = formData.get("departmentId") as string;
    const password = formData.get("password") as string;
    const file = formData.get("file") as File;

    if (!title || !departmentId || !password || !file) {
      return { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
    }

    // Find department to check password and get folder
    const dept = departmentsData.find((d) => d.slug === departmentId);
    if (!dept) {
      return { success: false, error: "ไม่พบข้อมูลกลุ่มงาน" };
    }

    if (dept.uploadPassword !== password) {
      return { success: false, error: "รหัสผ่านไม่ถูกต้อง" };
    }

    if (file.size === 0) {
      return { success: false, error: "กรุณาเลือกไฟล์เอกสาร" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + "-" + file.name.replaceAll(" ", "_");

    // Determine subfolder
    const subfolder = dept.uploadDir || "";
    const uploadDir = join(cwd(), "public", "uploads", subfolder);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);
    const fileUrl = subfolder
      ? `/uploads/${subfolder}/${filename}`
      : `/uploads/${filename}`;

    await prisma.departmentDocument.create({
      data: {
        title,
        departmentId,
        fileUrl,
      },
    });

    revalidatePath(`/main/about/department/${departmentId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to upload department document:", error);
    return {
      success: false,
      error: error.message || "Failed to upload document",
    };
  }
}

export async function deleteDepartmentDocument(
  id: number,
  fileUrl: string,
  departmentId: string,
) {
  try {
    await prisma.departmentDocument.delete({
      where: { id },
    });

    // Try to delete the file
    if (fileUrl) {
      // fileUrl is like /uploads/folder/filename
      // Remove leading slash and join with public
      const filepath = join(cwd(), "public", fileUrl);
      try {
        await unlink(filepath);
      } catch (e) {
        console.error("Failed to delete file from disk:", e);
      }
    }

    revalidatePath(`/main/about/department/${departmentId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete document:", error);
    return { success: false, error: "Failed to delete document" };
  }
}
