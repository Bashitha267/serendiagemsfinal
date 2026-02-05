import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartProvider from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Serendia Gems | Heart of Sri Lanka",
  description: "Ethically mined, expertly cut. Discover the world's finest Sapphires directly from the source.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-[#F8FAFC] text-gray-900 antialiased overflow-x-hidden`}
      >
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
              },
              success: {
                style: {
                  background: '#22c55e', // Green
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444', // Red
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#ef4444',
                },
              },
              loading: {
                style: {
                  background: '#3b82f6', // Blue
                  color: '#fff',
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
