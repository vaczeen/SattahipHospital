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
  color: string;
  bgGradient: string;
  iconClassName?: string;
  imageClassName?: string;
}

export const departmentsData: DepartmentItem[] = [
  {
    slug: "committee",
    icon: Users,
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-blue-100/50",
  },
  {
    slug: "health-insurance",
    icon: ShieldPlus,

    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-cyan-100/50",
  },
  {
    slug: "nursing",
    icon: (props: any) => <HugeiconsIcon icon={Doctor02Icon} {...props} />,

    color: "text-violet-600",
    bgGradient: "from-violet-50 to-violet-100/50",
  },
  {
    slug: "general-admin",
    icon: User,

    color: "text-orange-600",
    bgGradient: "from-orange-50 to-orange-100/50",
  },
  {
    slug: "medical-technology",
    icon: Microscope,

    color: "text-cyan-600",
    bgGradient: "from-cyan-50 to-cyan-100/50",
  },
  {
    slug: "radiology",
    icon: (props: any) => <HugeiconsIcon icon={XRayIcon} {...props} />,

    color: "text-rose-600",
    bgGradient: "from-rose-50 to-rose-100/50",
  },
  {
    slug: "dentistry",
    icon: (props: any) => <HugeiconsIcon icon={DentalToothIcon} {...props} />,

    color: "text-amber-600",
    bgGradient: "from-amber-50 to-amber-100/50",
  },
  {
    slug: "pharmacy",
    icon: (props: any) => <HugeiconsIcon icon={TestTube01Icon} {...props} />,

    color: "text-indigo-600",
    bgGradient: "from-indigo-50 to-indigo-100/50",
  },
  {
    slug: "thai-traditional-medicine",
    icon: TbMassage,

    color: "text-pink-600",
    bgGradient: "from-pink-50 to-pink-100/50",
  },
  {
    slug: "rehabilitation",
    icon: TbStretching,

    color: "text-blue-500",
    bgGradient: "from-blue-50 to-blue-100/50",
  },
  {
    slug: "primary-care",
    icon: HeartHandshake,

    color: "text-blue-500",
    bgGradient: "from-blue-50 to-blue-100/50",
  },
  {
    slug: "nutrition",
    icon: Salad,

    color: "text-blue-500",
    bgGradient: "from-blue-50 to-blue-100/50",
    iconClassName: "from-blue-50 to-blue-100/50",
  },
  {
    slug: "psychiatry",
    icon: (props: any) => <HugeiconsIcon icon={GivePillIcon} {...props} />,

    color: "text-black",
    bgGradient: "from-slate-50 to-slate-100/50",
    iconClassName: "bg-white group-hover:bg-white",
    imageClassName: "w-12 h-12",
  },
  {
    slug: "qualitycenter",
    icon: ChartSpline,
    color: "text-teal-700",
    bgGradient: "from-teal-50 to-teal-100/50",
    iconClassName: "bg-white group-hover:bg-white",
    imageClassName: "w-12 h-12",
  },
];
