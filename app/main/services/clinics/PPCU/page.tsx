"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock images for demonstration
const galleryImages1 = [
    "/km10pic.png",
    "/km10pic.png", // Using existing asset as placeholder
    "/km10pic.png",
];

const galleryImages2 = [
    "/km10pic.png",
    "/km10pic.png",
    "/km10pic.png",
];

const tabs = [
    { id: "general", label: "ข้อมูลทั่วไป" },
    { id: "time", label: "วัน เวลา และสถานที่ให้บริการ" },
    { id: "contact", label: "ข้อมูลติดต่อ" },
];

export default function DentalClinicPage() {
    const [activeTab, setActiveTab] = useState("general");

    const scrollToSection = (id: string) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative w-full h-[400px] flex items-center overflow-hidden">
                <Image
                    // headerpic
                    src="/km10pic.png"
                    alt="Dental Clinic"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />

                <div className="container mx-auto px-4 z-10 relative">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
                        แผนกผู้ป่วยนอก
                    </h1>
                    <p className="text-xl text-gray-600 font-light">
                        OPD
                    </p>
                </div>
            </div>

            {/* Sticky Sub-Navigation */}
            <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => scrollToSection(tab.id)}
                                className={cn(
                                    "px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                                    activeTab === tab.id
                                        ? "border-primary text-primary"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl space-y-16">

                {/* Mission Section */}
                <section id="general" className="scroll-mt-24">
                    <h2 className="text-2xl font-bold text-primary mb-6 border-l-4 border-secondary pl-4">
                        พันธกิจ
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-10 text-lg">
                        ให้บริการทางอายุรกรรมทั่วไปและเฉพาะทางในสาขาต่างๆ ให้กับผู้ป่วยทั่วไป
                        ผู้ป่วยที่มีโรคทางระบบที่ซับซ้อน ผู้สูงอายุ และผู้ป่วยระงับสติอารมณ์ในโรงพยาบาล
                        โดยทำงานเป็นทีมสหสาขาวิชาชีพ ตามมาตรฐานวิชาชีพที่ ปลอดภัย มีประสิทธิภาพ เหมาะสม
                        และนำสู่การรักษาที่เป็นต้นแบบ รวมทั้งเป็นแหล่งการเรียนการสอนทางคลินิกสำหรับนิสิตแพทย์ในระดับปริญญาตรีและบัณฑิตศึกษา
                    </p>

                    {/* Gallery 1 */}
                    <ImageCarousel images={galleryImages1} />
                </section>

                {/* Supporting Mission Section */}
                <section>
                    <h2 className="text-2xl font-bold text-primary mb-6 border-l-4 border-secondary pl-4">
                        ภารกิจที่หน่วยงานที่สนับสนุน
                    </h2>
                    <ul className="space-y-4 text-gray-700 list-decimal pl-5 leading-loose">
                        <li>การให้บริการรักษาทางทันตกรรมแก่ประชาชนทั่วไปและผู้ป่วยทั่วไป</li>
                        <li>การมีส่วนร่วมในสหสาขาวิชาชีพในการดูแลผู้ป่วยและผู้สูงอายุอย่างเป็นองค์รวม โดยให้บริการทางทันตกรรมแก่ผู้ป่วยที่ได้รับการส่งปรึกษาทางการแพทย์ผู้เชี่ยวชาญสาขาต่างๆ</li>
                        <li>พัฒนาและสร้างนวัตกรรมในด้านทันตกรรม โดยร่วมมือกับแพทย์ในสาขาต่างๆ เพื่อศักยภาพการทำงานทันตกรรมและพัฒนาคุณภาพชีวิตของผู้ป่วยในภาวะเจ็บป่วยต่างๆ</li>
                        <li>การให้บริการดูแลสุขภาพช่องปากและให้การรักษาทางทันตกรรมแก่บุคลากรของโรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย รวมทั้งครอบครัวและเจ้าหน้าที่</li>
                        <li>ความร่วมมือกับหน่วยกิจกรรมนิสิตและเสริมสร้าง ภาควิชาศัลยศาสตร์ คณะแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย และศูนย์สมเด็จพระเทพรัตนฯ แก้ไขความพิการบนใบหน้าและกะโหลกศีรษะ โรงพยาบาลจุฬาลงกรณ์ ในด้านกะโหลกศีรษะและใบหน้าและช่องปาก เพื่อให้การรักษาที่ครบวงจรและเกิดประโยชน์สูงสุด</li>
                        <li>ความร่วมมือกับศูนย์ความเชี่ยวชาญทางการแพทย์ด้านการดูแลผู้สูงอายุในการดำเนินโครงการต้นแบบการดูแลสุขภาพช่องปากแบบเป็นองค์รวมสำหรับผู้สูงอายุ โดยมีเป้าหมายเพื่อพัฒนารูปแบบของการประเมินสภาวะต่างๆที่เป็นปัจจัยเสี่ยงที่ส่งผลต่อการเสื่อมถอยของสุขภาพในช่วงวัยชรา และนำไปสู่รูปแบบของการส่งเสริมสุขภาพและป้องกันโรค เพื่อเป้าหมายที่จะเป็นส่วนหนึ่งในการชะลอกลุ่มผู้สูงวัยที่ช่วยเหลือตนเองได้ดี ที่จะเข้าสู่กลุ่มผู้สูงวัยที่ต้องพึ่งพิงผู้อื่นให้เกิดขึ้นช้าที่สุดเท่าที่จะเป็นไปได้</li>
                        <li>ความร่วมมือกับภาควิชาศัลยศาสตร์ช่องปาก คณะทันตแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัยในการร่วมสอนภาคปฏิบัติ งานศัลยกรรมในช่องปากและการดูแลผู้ป่วยที่มารับการรักษาในโรงพยาบาลระดับตติยภูมิแก่นิสิตทันตแพทย์ระดับปริญญาตรีและนิสิตระดับบัณฑิตศึกษา</li>
                        <li>ความร่วมมือกับหลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาทันตกรรมผู้สูงอายุและดูแลผู้ป่วยพิเศษ (หลักสูตรนานาชาติ) คณะทันตแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัยในการร่วมสอนภาคปฏิบัติ การดูแลผู้สูงอายุที่มารับการรักษาในโรงพยาบาลระดับตติยภูมิแก่นิสิตระดับปริญญา</li>
                        <li>ความร่วมมือกับศูนย์ฝึกราชการโรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย ในการทำเครื่องมือเพื่อรักษาผู้ป่วยที่มีภาวะหยุดหายใจขณะหลับ โดยมี รศ. ทพญ. ดร.เปรมทิพย์ วชิรานนท์ จากคณะทันตแพทยศาสตร์มหาวิทยาลัยสงขลานครินทร์ มาเป็นที่ปรึกษาแก่ผู้เชี่ยวชาญ</li>
                    </ul>

                    {/* Gallery 2 */}
                    <div className="mt-10">
                        <ImageCarousel images={galleryImages2} />
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
                    {/* Time & Location */}
                    <section id="time" className="scroll-mt-24 space-y-4">
                        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                            <Clock className="w-5 h-5 text-secondary" />
                            วัน เวลา และสถานที่ให้บริการ
                        </h3>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex justify-between">
                                    <span>จันทร์ - ศุกร์</span>
                                    <span className="font-semibold text-primary">08:00 - 16:00 น.</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>คลินิกพิเศษ (นอกเวลา)</span>
                                    <span className="font-semibold text-primary">16:00 - 20:00 น.</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>เสาร์ - อาทิตย์</span>
                                    <span className="font-semibold text-primary">08:00 - 12:00 น.</span>
                                </li>
                            </ul>
                            <div className="mt-4 pt-4 border-t border-gray-200 flex items-start gap-2">
                                <MapPin className="w-5 h-5 text-secondary mt-1 shrink-0" />
                                <span>อาคารผู้ป่วยนอก ชั้น 1 โรงพยาบาลสัตหีบ กม.10</span>
                            </div>
                        </div>
                    </section>

                    {/* Contact */}
                    <section id="contact" className="scroll-mt-24 space-y-4">
                        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                            <Phone className="w-5 h-5 text-secondary" />
                            ข้อมูลติดต่อ
                        </h3>
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <p className="text-gray-700 mb-4">
                                สอบถามข้อมูลเพิ่มเติม หรือนัดหมายล่วงหน้าได้ที่
                            </p>
                            <div className="text-center space-y-2">
                                <a href="tel:038245051" className="block text-2xl font-bold text-primary hover:text-secondary transition-colors">
                                    038-245-051
                                </a>
                                <p className="text-gray-500">ต่อ 409 (คลินิกทันตกรรม)</p>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}

function ImageCarousel({ images }: { images: string[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollTo = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 350;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
            const index = Math.round(scrollPercentage * (images.length - 1));
            // Simple estimation
        }
    };

    return (
        <div className="relative group/carousel">
            <button
                onClick={() => scrollTo('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-2 bg-white/90 shadow-lg rounded-full text-primary hover:text-secondary opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            >
                <ChevronLeft />
            </button>
            <button
                onClick={() => scrollTo('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-2 bg-white/90 shadow-lg rounded-full text-primary hover:text-secondary opacity-0 group-hover/carousel:opacity-100 transition-opacity"
            >
                <ChevronRight />
            </button>

            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto gap-4 scrollbar-hide py-4 px-2 snap-x"
            >
                {images.map((src, i) => (
                    <div key={i} className="min-w-[300px] md:min-w-[400px] aspect-[4/3] relative rounded-lg overflow-hidden shadow-md snap-center shrink-0">
                        <Image
                            src={src}
                            alt={`Gallery ${i + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-2 mt-2">
                {images.map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
                ))}
            </div>
        </div>
    );
}
