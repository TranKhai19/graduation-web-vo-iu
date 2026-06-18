import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { LanguageProvider } from "@/lib/LanguageContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Lễ Tốt Nghiệp của Phan Ngọc Ý Mỹ | Graduation Ceremony",
  description: "Trân trọng kính mời mọi người đến tham dự Lễ tốt nghiệp của Phan Ngọc Ý Mỹ tại Đại học Đông Á vào ngày 10/07/2026. Sự hiện diện của mọi người là niềm vinh hạnh lớn đối với mình!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${outfit.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#F4F9F5] text-[#1E3328] font-sans selection:bg-[#0F5E3D] selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
