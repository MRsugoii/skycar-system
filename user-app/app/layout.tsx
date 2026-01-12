import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skycar Dispatch System 派車調度管理系統 - 會員端",
  description: "Skycar Dispatch System 派車調度管理系統 - 會員端",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body>
        <div style={{ padding: 20 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
