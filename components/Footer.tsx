import Link from "next/link";
export function Footer() {
  return (
    <footer className="bg-teal-950 text-primary-foreground py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
          <div>
            <h3 className="text-xl font-bold mb-4">Sattahip Hospital</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              โรงพยาบาลสัตหีบ ยินดีให้บริการประชาชนทุกท่าน
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Important Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a href="/main/services/clinics" className="hover:underline">
                  บริการ
                </a>
              </li>
              <li>
                <a href="/main/news" className="hover:underline">
                  ข่าวสาร
                </a>
              </li>
              <li>
                <a href="/main/contact" className="hover:underline">
                  ติดต่อเรา
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>โทร: 038245051 </li>
              <li>Email: complaintkm10@gmail.com</li>
              <li>Address:331 ทางหลวงยุทธศาสตร์ สัตหีบ - พนมสารคาม ต.พลูตาหลวง 20180,
              อ.สัตหีบ, จ.ชลบุรี</li>
              <li>ประเทศไทย</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex justify-between items-center text-sm opacity-60">
          <p>© 2026 Sattahip Hospital At Rights Reserved by IT Department</p>
          <div className="flex gap-4">
            {/* Social Icons would go here */}
            {/* <span>LinkedIn</span> */}
            <span>
              <Link href="https://www.facebook.com/sattahipkm10hospital">
                Facebook
              </Link>
            </span>
            {/* <span>Instagram</span> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
