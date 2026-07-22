import { Hero } from "@/components/Hero";
import { HomePage } from "@/components/HomePage";
import AnnouncementPopup from "@/components/AnnouncementPopup";

export default function Home() {
  return (
    <>
     <AnnouncementPopup />
      <Hero />
      <HomePage />
    </>
  );
}
