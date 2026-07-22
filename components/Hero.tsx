import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative w-full h-600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/km10pic.png"
        alt="Hospital Background"
        fill
        className="object-cover object-center blur-sm"
        priority
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/70" />

      {/* Decorative background circle */}
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-100 rounded-full blur-xl opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
        {/* Text Content */}
        <div className="text-center md:text-left">
          <span className=" text-teal-500 font-bold tracking-widest uppercase text-sm mb-4 block">
            Caring for Life
          </span>
          <h1 className="text-4xl md:text-6xl font-tidy text-gray-800 font-bold mb-6 leading-tight">
            โรงพยาบาลสัตหีบ
          </h1>
          <h1 className="text-4xl md:text-6xl font-tidy text-gray-800 font-bold mb-6 leading-tight">
            ยินดีต้อนรับ
          </h1>
          <p className="max-w-xl text-muted-foreground mb-8 ">
            บริการด้วยความปลอดภัย มุ่งสู่ความทันสมัยด้วยเทคโนโลยี
            พัฒนาบุคลากรอย่างต่อเนื่อง
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link
              className="bg-gray-950 text-white px-8 py-3 rounded-full hover:bg-gray-700 hover:text-white transition-colors font-bold"
              href="/main/services/clinics"
            >
              บริการของเรา
            </Link>
          </div>
        </div>

        {/* Doctor Image */}
        <div className="hidden md:flex justify-center items-end h-full relative">
          <div className="relative w-[2500px] h-[600px] mt-auto">
            {/* <Image
                            src="/doc.png"
                            alt="Doctor"
                            fill
                            className="object-contain object-bottom drop-shadow-xl"
                            priority
                        /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
