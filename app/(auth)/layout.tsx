import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";

export const metadata = {
  title: "Real-Estate",
  description:
    "Discover a comprehensive online platform where you can effortlessly engage in the purchase and sale of a diverse range of real estate assets, including properties, homes, commercial spaces, and PG accommodations.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <main className="w-full flex justify-center items-center min-h-screen">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
