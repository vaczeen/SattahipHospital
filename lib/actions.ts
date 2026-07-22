"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { cwd } from "process";

export async function getProcurements() {
    try {
        const procurements = await prisma.procurement.findMany({
            orderBy: {
                publishedAt: "desc",
            },
        });
        return procurements;
    } catch (error) {
        console.error("Failed to fetch procurements:", error);
        return [];
    }
}

export async function createProcurement(formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;
        const dateStr = formData.get("date") as string;
        const file = formData.get("file") as File;

        if (!title || !category || !dateStr || !file) {
            return { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
        }

        if (file.size === 0) {
            return { success: false, error: "กรุณาเลือกไฟล์เอกสาร" };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + "-" + file.name.replaceAll(" ", "_");
        const uploadDir = join(cwd(), "public", "uploads");
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);
        const fileUrl = `/uploads/${filename}`;

        await prisma.procurement.create({
            data: {
                title,
                description,
                category,
                publishedAt: new Date(dateStr),
                fileUrl,
            },
        });

        revalidatePath("/procurement");
        revalidatePath("/procurement/admin");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create procurement:", error);
        return { success: false, error: error.message || "Failed to create procurement" };
    }
}

export async function deleteProcurement(id: number, fileUrl: string) {
    try {
        await prisma.procurement.delete({
            where: { id },
        });

        // Try to delete the file
        if (fileUrl) {
            const filename = fileUrl.split("/").pop();
            if (filename) {
                const filepath = join(cwd(), "public", "uploads", filename);
                try {
                    await unlink(filepath);
                } catch (e) {
                    console.error("Failed to delete file:", e);
                }
            }
        }

        revalidatePath("/procurement");
        revalidatePath("/procurement/admin");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete procurement:", error);
        return { success: false, error: "Failed to delete procurement" };
    }
}
