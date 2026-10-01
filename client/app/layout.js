import { Cormorant_Garamond, Manrope } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import SmoothScroll from "@/components/animations/SmoothScroll";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "Clarity Auto Spa | Premium Auto Detail Shop",
  description: "Experience the best auto detailing at Clarity Auto Spa. Expert staff and premium service.",
  icons: {
    icon: "/clarity.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${cormorant.variable} ${manrope.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased min-h-screen flex flex-col text-[16px] md:text-[17px] leading-[1.65]">
        <SmoothScroll>
          <Navbar />
          <main className="flex-grow pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomBar />
        </SmoothScroll>
      </body>
    </html>
  );
}
