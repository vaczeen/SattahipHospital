import axios from "axios";

export const sendLineFlexMessage = async (
  altText: string,
  flexContents: object
): Promise<void> => {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const groupId = process.env.LINE_GROUP_ID;

  if (!token || !groupId) {
    console.error("❌ LINE_CHANNEL_ACCESS_TOKEN หรือ LINE_GROUP_ID ยังไม่ได้ตั้งค่า");
    return;
  }

  try {
    await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: groupId,
        messages: [
          {
            type: "flex",
            altText, // ข้อความแสดงใน notification bar
            contents: flexContents,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("✅ ส่ง LINE Flex Message สำเร็จ");
  } catch (err: any) {
    console.error("❌ LINE error:", err.response?.data || err.message);
  }
};