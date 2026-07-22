"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { cwd } from "process";

export async function getPolicyDocuments() {
    try {
        const docs = await prisma.policyDocument.findMany({
            orderBy: { publishedAt: "desc" },
        });
        return docs;
    } catch (error) {
        console.error("Failed to fetch policy documents:", error);
        return [];
    }
}

export async function createPolicyDocument(formData: FormData) {
    try {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;
        const dateStr = formData.get("date") as string;
        const file = formData.get("file") as File;

        if (!title || !category || !dateStr || !file || file.size === 0) {
            return { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = uniqueSuffix + "-" + file.name.replaceAll(" ", "_");
        const uploadDir = join(cwd(), "public", "uploads", "policy");

        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), buffer);

        const fileUrl = `/uploads/policy/${filename}`;

        await prisma.policyDocument.create({
            data: {
                title,
                description: description || null,
                category,
                publishedAt: new Date(dateStr),
                fileUrl,
            },
        });

        revalidatePath("/policy");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to create policy document:", error);
        return { success: false, error: error.message || "เกิดข้อผิดพลาด" };
    }
}

export async function deletePolicyDocument(id: number, fileUrl: string) {
    try {
        await prisma.policyDocument.delete({ where: { id } });

        if (fileUrl) {
            const parts = fileUrl.split("/");
            const filename = parts.pop();
            if (filename) {
                const filepath = join(cwd(), "public", "uploads", "policy", filename);
                try {
                    await unlink(filepath);
                } catch (e) {
                    console.error("Failed to delete file:", e);
                }
            }
        }

        revalidatePath("/policy");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete policy document:", error);
        return { success: false, error: "เกิดข้อผิดพลาดในการลบข้อมูล" };
    }
}
