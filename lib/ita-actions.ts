"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { cwd } from "process";

export type ITAItemData = {
  id: number;
  title: string;
  description: string | null;
  fileUrl: string | null;
  level: number;
  parentId: number | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  children: ITAItemData[];
};

// Build tree from flat list
function buildTree(flat: any[]): ITAItemData[] {
  const map = new Map<number, ITAItemData>();
  const roots: ITAItemData[] = [];

  // Create nodes
  flat.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  // Link parent-child
  flat.forEach((item) => {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Sort children by sortOrder
  const sortChildren = (nodes: ITAItemData[]) => {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder);
    nodes.forEach((n) => sortChildren(n.children));
  };
  sortChildren(roots);

  return roots;
}

// Fetch all ITA items as a tree (any depth), optionally filtered by year
export async function getITATree(year?: number) {
  try {
    const where: any = {};
    if (year != null && year > 0) {
      where.year = year;
    }
    const all = await prisma.iTAItem.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
    return buildTree(all as unknown as any[]);
  } catch (error) {
    console.error("Failed to fetch ITA tree:", error);
    return [];
  }
}

// Get all distinct years that have ITA items
export async function getITAYears(): Promise<number[]> {
  try {
    const items = await prisma.iTAItem.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });
    return items
      .map((i) => i.year)
      .filter((y) => y > 0)
      .sort((a, b) => b - a);
  } catch (error) {
    console.error("Failed to fetch ITA years:", error);
    return [];
  }
}

// Create a new ITA item
export async function createITAItem(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || null;
    const parentId = formData.get("parentId") as string | null;
    const level = parseInt(formData.get("level") as string) || 0;
    const file = formData.get("file") as File | null;

    if (!title) {
      return { success: false, error: "กรุณากรอกชื่อหัวข้อ" };
    }

    let fileUrl: string | null = null;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = uniqueSuffix + "-" + file.name.replaceAll(" ", "_");
      const uploadDir = join(cwd(), "public", "uploads", "ita");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, filename), buffer);
      fileUrl = `/uploads/ita/${filename}`;
    }

    // Determine sort order: count existing siblings + 1
    const year = parseInt(formData.get("year") as string) || 0;

    const siblingsCount = await prisma.iTAItem.count({
      where: { parentId: parentId ? parseInt(parentId) : null },
    });

    const item = await prisma.iTAItem.create({
      data: {
        title,
        description,
        fileUrl,
        year,
        level,
        parentId: parentId ? parseInt(parentId) : null,
        sortOrder: siblingsCount,
      },
    });

    revalidatePath("/main/ITA");
    return { success: true, id: item.id };
  } catch (error: any) {
    console.error("Failed to create ITA item:", error);
    return { success: false, error: error.message || "เกิดข้อผิดพลาด" };
  }
}

// Update an ITA item (title, description, file)
export async function updateITAItem(formData: FormData) {
  try {
    const id = parseInt(formData.get("id") as string);
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || null;
    const existingFileUrl = formData.get("existingFileUrl") as string | null;
    const file = formData.get("file") as File | null;

    if (!id || !title) {
      return { success: false, error: "ข้อมูลไม่ครบถ้วน" };
    }

    let fileUrl = existingFileUrl;

    // If new file uploaded, save it and optionally delete old one
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = uniqueSuffix + "-" + file.name.replaceAll(" ", "_");
      const uploadDir = join(cwd(), "public", "uploads", "ita");
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, filename), buffer);

      // Delete old file
      if (existingFileUrl) {
        const parts = existingFileUrl.split("/");
        const oldFilename = parts.pop();
        if (oldFilename) {
          try {
            await unlink(join(cwd(), "public", "uploads", "ita", oldFilename));
          } catch (e) {
            /* ignore */
          }
        }
      }

      fileUrl = `/uploads/ita/${filename}`;
    }

    await prisma.iTAItem.update({
      where: { id },
      data: {
        title,
        description,
        fileUrl,
      },
    });

    revalidatePath("/main/ITA");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update ITA item:", error);
    return { success: false, error: error.message || "เกิดข้อผิดพลาด" };
  }
}

// Delete an ITA item and all its children recursively
export async function deleteITAItem(id: number) {
  try {
    // Find all descendants to collect file URLs for cleanup
    const allItems = await prisma.iTAItem.findMany();
    const toDelete = new Set<number>();
    const collect = (parentId: number) => {
      toDelete.add(parentId);
      allItems.forEach((item) => {
        if (item.parentId === parentId) collect(item.id);
      });
    };
    collect(id);

    const fileUrls = allItems
      .filter((i) => toDelete.has(i.id) && i.fileUrl)
      .map((i) => i.fileUrl!);

    // Delete the item (cascade will delete children in DB)
    await prisma.iTAItem.delete({ where: { id } });

    // Delete physical files
    for (const url of fileUrls) {
      const parts = url.split("/");
      const filename = parts.pop();
      if (filename) {
        try {
          await unlink(join(cwd(), "public", "uploads", "ita", filename));
        } catch (e) {
          /* ignore */
        }
      }
    }

    revalidatePath("/main/ITA");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete ITA item:", error);
    return { success: false, error: error.message || "เกิดข้อผิดพลาดในการลบ" };
  }
}
