import { PrismaClient } from "@prisma/client";

export async function seedDepartmentConfig(prisma: PrismaClient) {
  await prisma.departmentConfig.createMany({
    data: [
      { slug: "committee", label: "คณะกรรมการต่างๆ", uploadPassword: "cm", uploadDir: "committee" },
      { slug: "health-insurance", label: "กลุ่มงานประกันสุขภาพฯ", uploadPassword: "hi", uploadDir: "insurance" },
      { slug: "nursing", label: "กลุ่มงานการพยาบาล", uploadPassword: "nu", uploadDir: "nurse" },
      { slug: "general-admin", label: "กลุ่มงานบริหารทั่วไป", uploadPassword: "ga", uploadDir: "generalAdmin" },
      { slug: "medical-technology", label: "กลุ่มงานเทคนิคการแพทย์", uploadPassword: "mt", uploadDir: "medTech" },
      { slug: "radiology", label: "กลุ่มงานรังสีวิทยา", uploadPassword: "rd", uploadDir: "xray" },
      { slug: "dentistry", label: "กลุ่มงานทันตกรรม", uploadPassword: "dt", uploadDir: "dental" },
      { slug: "pharmacy", label: "กลุ่มงานเภสัชกรรมฯ", uploadPassword: "ph", uploadDir: "phar" },
      { slug: "thai-traditional-medicine", label: "กลุ่มงานแพทย์แผนไทยฯ", uploadPassword: "tm", uploadDir: "massage" },
      { slug: "rehabilitation", label: "กลุ่มงานเวชกรรมฟื้นฟู", uploadPassword: "rh", uploadDir: "PT" },
      { slug: "primary-care", label: "กลุ่มงานบริการด้านปฐมภูมิและองค์รวม", uploadPassword: "pc", uploadDir: "pratomPhum" },
      { slug: "nutrition", label: "กลุ่มงานโภชนศาสตร์", uploadPassword: "nt", uploadDir: "nutrition" },
      { slug: "psychiatry", label: "กลุ่มงานจิตเวชและยาเสพติด", uploadPassword: "ps", uploadDir: "psychiatry" },
      { slug: "qualitycenter", label: "ศูนย์คุณภาพ", uploadPassword: "qc", uploadDir: "qualitycenter" },
    ],
    skipDuplicates: true,
  });
  console.log("✅ DepartmentConfig seeded");
}