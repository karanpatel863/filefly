import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { KobbleProvider } from "@kobbleio/next/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Filefly | File sharing made easy",
  description: "Transform your files into shareable links with Filefly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <KobbleProvider>{children}</KobbleProvider>
      </body>
    </html>
  );
}
