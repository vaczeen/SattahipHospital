import prisma from "@/lib/prisma";
import { sendLineFlexMessage } from "@/lib/lineNotify";

export const notifyPendingOrder = async (orderId: number): Promise<void> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderedBy: {
          select: { name: true, email: true, office: true },
        },
        products: {
          include: {
            product: {
              select: { title: true, unit: true },
            },
          },
        },
      },
    });

    if (!order || order.orderStatus !== "Pending") return;

    // แปลงวันที่เป็น พ.ศ.
    const date = new Date(order.createdAt);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const yearBE = date.getFullYear() + 543;
    const formattedDate = `${day}/${month}/${yearBE}`;

    // สร้าง rows รายการพัสดุ
    const productRows = order.products.map((item) => ({
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: `• ${item.product.title}`,
          size: "sm",
          color: "#555555",
          flex: 4,
          wrap: true,
        },
        {
          type: "text",
          text: `x${item.count}${item.product.unit ? ` ${item.product.unit}` : ""}`,
          size: "sm",
          color: "#111111",
          flex: 1,
          align: "end",
        },
      ],
    }));

    // Flex Message structure
    const flexContents = {
      type: "bubble",
      size: "giga",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#F59E0B",
        paddingAll: "16px",
        contents: [
          {
            type: "text",
            text: "🔔 มีรายการเบิกพัสดุใหม่",
            color: "#FFFFFF",
            weight: "bold",
            size: "lg",
          },
          {
            type: "text",
            text: `Order ID: #${order.id}`,
            color: "#FFFFFF",
            size: "sm",
            margin: "xs",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "16px",
        contents: [
          // Info section
          {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "👤 ผู้เบิก", size: "sm", color: "#888888", flex: 2 },
                  { type: "text", text: order.orderedBy.name || order.orderedBy.email, size: "sm", color: "#111111", flex: 3, wrap: true },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "🏢 แผนก", size: "sm", color: "#888888", flex: 2 },
                  { type: "text", text: order.office || order.orderedBy.office || "-", size: "sm", color: "#111111", flex: 3, wrap: true },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "📅 วันที่", size: "sm", color: "#888888", flex: 2 },
                  { type: "text", text: formattedDate, size: "sm", color: "#111111", flex: 3 },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  { type: "text", text: "📋 Status", size: "sm", color: "#888888", flex: 2 },
                  {
                    type: "text",
                    text: "⏳ Pending",
                    size: "sm",
                    color: "#F59E0B",
                    weight: "bold",
                    flex: 3,
                  },
                ],
              },
            ],
          },
          // Divider
          { type: "separator" },
          // Product list
          {
            type: "text",
            text: "📦 รายการพัสดุ",
            weight: "bold",
            size: "sm",
            color: "#333333",
          },
          {
            type: "box",
            layout: "vertical",
            spacing: "xs",
            contents: productRows,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        paddingAll: "12px",
        contents: [
          {
            type: "button",
            action: {
              type: "postback",
              label: "✅ Shipped",
              // ส่ง orderId กลับมาที่ webhook
              data: `action=shipped&orderId=${order.id}`,
              displayText: `จ่าย Order #${order.id} เรียบร้อยแล้ว`,
            },
            style: "primary",
            color: "#10B981",
            height: "sm",
          },
        ],
      },
    };

    await sendLineFlexMessage(
      `แจ้งเตือน: มีรายการเบิกพัสดุใหม่ Order #${order.id}`,
      flexContents
    );
  } catch (err) {
    console.error("❌ notifyPendingOrder error:", err);
  }
};