import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PROPERTY } from "@/lib/config/property";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: PROPERTY.seo.title, template: `%s | ${PROPERTY.name}` },
  description: PROPERTY.seo.description,
  keywords: [...PROPERTY.seo.keywords], // <-- We added the spread operator here
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // We added suppressHydrationWarning here to mute browser extension/autofill attributes
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}