import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Smartphone,
  Printer,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/main"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-6 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
        กลับหน้าแรก
      </Link>
      <h1 className="text-3xl font-bold text-gray-950 mb-8 border-l-4 border-emerald-700 pl-4">
        ติดต่อเรา
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-950">
              <MapPin className="mr-2 text-emerald-700" /> ข้อมูลที่อยู่
            </h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <p className="text-gray-700 leading-relaxed">
                331 ทางหลวงยุทธศาสตร์ สัตหีบ - พนมสารคาม
                <br />
                Phlu Ta Luang, Sattahip District, Chon Buri 20180
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-950">
              <Phone className="mr-2 text-emerald-700" /> ข้อมูลการติดต่อ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="tel:038245051"
                className="flex items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-700 hover:bg-secondary/5 transition-all group"
              >
                <Phone className="w-5 h-5 mr-3 text-emerald-700 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-gray-400">โทรศัพท์</p>
                  <p className="font-medium text-gray-700">038-245051</p>
                </div>
              </a>
              <a
                href="tel:0660056082"
                className="flex items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-700 hover:bg-secondary/5 transition-all group"
              >
                <Smartphone className="w-5 h-5 mr-3 text-emerald-700 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-gray-400">มือถือ</p>
                  <p className="font-medium text-gray-700">066-005-6082</p>
                </div>
              </a>
              <div className="flex items-center p-4 bg-white rounded-xl border border-gray-100 group">
                <Printer className="w-5 h-5 mr-3 text-emerald-700" />
                <div>
                  <p className="text-xs text-gray-400">แฟกซ์</p>
                  <p className="font-medium text-gray-700">
                    038-245051 ต่อ 409
                  </p>
                </div>
              </div>
              <a
                href="mailto:complaintkm10@gmail.com"
                className="flex items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-700 hover:bg-secondary/5 transition-all group"
              >
                <Mail className="w-5 h-5 mr-3 text-emerald-700 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-xs text-gray-400">อีเมล</p>
                  <p className="font-medium text-gray-700">
                    complaintkm10@gmail.com
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-950">
            <MapPin className="mr-2 text-emerald-700" /> แผนที่
          </h2>
          <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3892.2412979061714!2d100.9691034841469!3d12.697667688852063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31028cb9df635381%3A0x5b3ff42d4586c807!2sSattahip%20Hospital%20Km.%2010!5e0!3m2!1sen!2sth!4v1770347774401!5m2!1sen!2sth"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sattahip KM 10 Hospital Map"
            ></iframe>
          </div>
          <div className="mt-4 flex justify-end">
            <a
              href="https://maps.app.goo.gl/uXv9t2k3JQ2JQ2JQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-700 hover:underline flex items-center"
            >
              เปิดใน Google Maps <Smartphone className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
