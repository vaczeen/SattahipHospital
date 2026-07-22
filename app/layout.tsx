import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google";
import localFont from "next/font/local"; // Import localFont
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
});

// Configure Attha Loopless
const tidy = localFont({
  src: [
    {
      path: "./fonts/172PANITidyDemo-Regular.ttf", // Assumed path
      weight: "400",
      style: "normal",
    },
    // Add other weights if available, e.g.:
    // { path: "./fonts/AtthaLoopless-Bold.ttf", weight: "700" },
  ],
  variable: "--font-tidy",
});

export const metadata: Metadata = {
  title: "Sattahip km 10 Hospital",
  description: "Better Information, Better Health",
};



// ... existing imports ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${kanit.variable} ${tidy.variable} min-h-screen flex flex-col font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
