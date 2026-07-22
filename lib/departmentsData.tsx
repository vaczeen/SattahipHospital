import React from "react";
import {
  User,
  ShieldPlus,
  Microscope,
  Salad,
  Pill,
  HeartHandshake,
  Users,
  ChartSpline,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DentalToothIcon,
  TestTube01Icon,
  Doctor02Icon,
  XRayIcon,
  GivePillIcon,
} from "@hugeicons/core-free-icons";
import { TbMassage, TbStretching } from "react-icons/tb";

export interface DepartmentItem {
  slug: string;
  icon?: React.ElementType;
  imageSrc?: string;
  label: string;
  description: string;
  color: string;
  bgGradient: string;
  href?: string;
  iconClassName?: string;
  imageClassName?: string;
  uploadPassword?: string;
  uploadDir?: string;
}

export const departmentsData: DepartmentItem[] = [
  {
    slug: "committee",
    icon: Users,
    label: "คณะกรรมการต่างๆ",
    description: "",
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-blue-100/50",
    uploadPassword: "cm",
    uploadDir: "committee",
  },
  {
    slug: "health-insurance",
    icon: ShieldPlus,
    label: "กลุ่มงานประกันสุขภาพฯ",
    description: "",
    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-cyan-100/50",
    uploadPassword: "hi",
    uploadDir: "insurance",
  },
  {
    slug: "nursing",
    icon: (props: any) => <HugeiconsIcon icon={Doctor02Icon} {...props} />,
    label: "กลุ่มงานการพยาบาล",
    description: "",
    color: "text-violet-600",
    bgGradient: "from-violet-50 to-violet-100/50",
    uploadPassword: "nu",
    uploadDir: "nurse",
  },
  {
    slug: "general-admin",
    icon: User,
    label: "กลุ่มงานบริหารทั่วไป",
    description: "",
    color: "text-orange-600",
    bgGradient: "from-orange-50 to-orange-100/50",
    uploadPassword: "ga",
    uploadDir: "generalAdmin",
  },
  {
    slug: "medical-technology",
    icon: Microscope,
    label: "กลุ่มงานเทคนิคการแพทย์",
    description: "",
    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-cyan-100/50",
    uploadPassword: "mt",
    uploadDir: "medTech",
  },
  {
    slug: "radiology",
    icon: (props: any) => <HugeiconsIcon icon={XRayIcon} {...props} />,
    label: "กลุ่มงานรังสีวิทยา",
    description: "",
    color: "text-rose-600",
    bgGradient: "from-rose-50 to-rose-100/50",
    uploadPassword: "rd",
    uploadDir: "xray",
  },
  {
    slug: "dentistry",
    icon: (props: any) => <HugeiconsIcon icon={DentalToothIcon} {...props} />,
    label: "กลุ่มงานทันตกรรม",
    description: "",
    color: "text-amber-600",
    bgGradient: "from-amber-50 to-amber-100/50",
    uploadPassword: "dt",
    uploadDir: "dental",
  },
  {
    slug: "pharmacy",
    icon: (props: any) => <HugeiconsIcon icon={TestTube01Icon} {...props} />,
    label: "กลุ่มงานเภสัชกรรมฯ",
    description: "",
    color: "text-indigo-600",
    bgGradient: "from-indigo-50 to-indigo-100/50",
    uploadPassword: "ph",
    uploadDir: "phar",
  },
  {
    slug: "thai-traditional-medicine",
    icon: TbMassage,
    label: "กลุ่มงานแพทย์แผนไทยฯ",
    description: "",
    color: "text-pink-600",
    bgGradient: "from-pink-50 to-pink-100/50",
    uploadPassword: "tm",
    uploadDir: "massage",
  },
  {
    slug: "rehabilitation",
    icon: TbStretching,
    label: "กลุ่มงานเวชกรรมฟื้นฟู",
    description: "",
    color: "text-blue-500",
    bgGradient: "from-blue-50 to-blue-100/50",
    uploadPassword: "rh",
    uploadDir: "PT",
  },
  {
    slug: "primary-care",
    icon: HeartHandshake,
    label: "กลุ่มงานบริการด้านปฐมภูมิและองค์รวม",
    description: "",
    color: "text-blue-500",
    bgGradient: "from-blue-50 to-blue-100/50",
    uploadPassword: "pc",
    uploadDir: "pratomPhum",
  },
  {
    slug: "nutrition",
    icon: Salad,
    label: "กลุ่มงานโภชนศาสตร์",
    description: "",
    color: "text-blue-500",
    bgGradient: "from-blue-50 to-blue-100/50",
    iconClassName: "from-blue-50 to-blue-100/50",
    uploadPassword: "nt",
    uploadDir: "nutrition",
  },
  {
    slug: "psychiatry",
    icon: (props: any) => <HugeiconsIcon icon={GivePillIcon} {...props} />,
    label: "กลุ่มงานจิตเวชและยาเสพติด",
    description: "",
    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    iconClassName: "bg-white group-hover:bg-white",
    imageClassName: "w-12 h-12",
    uploadPassword: "ps",
    uploadDir: "psychiatry",
  },
  {
    slug: "qualitycenter",
    icon: ChartSpline,
    label: "ศูนย์คุณภาพ",
    description: "",
    color: "text-teal-700",
    bgGradient: "from-teal-50 to-teal-100/50",
    iconClassName: "bg-white group-hover:bg-white",
    imageClassName: "w-12 h-12",
    uploadPassword: "qc",
    uploadDir: "qualitycenter",
  },
];
