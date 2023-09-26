import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Real-Estate",
  description:
    "Discover a comprehensive online platform where you can effortlessly engage in the purchase and sale of a diverse range of real estate assets, including properties, homes, commercial spaces, and PG accommodations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} `}>
          <Navbar />
          <section className="main-container bg-[#FFFCF8]">
            <div className="w-full ">{children}</div>
          </section>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
