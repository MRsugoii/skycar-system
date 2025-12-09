import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skycar Dispatch System 派車調度管理系統 - 司機端",
  description: "Skycar Dispatch System 派車調度管理系統 - 司機端",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body className={`${inter.className} bg-gray-100 min-h-screen flex justify-center items-start antialiased text-gray-900`}>
        <div className="w-full max-w-[420px] min-h-screen bg-gray-50 shadow-2xl overflow-x-hidden relative">
          {children}
        </div>
      </body>
    </html>
  );
}
