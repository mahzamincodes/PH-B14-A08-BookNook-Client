import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const poppins = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

export const metadata = {
    title: "BookNook",
    description: "Discover, share, and borrow books with BookNook.",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${poppins.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col bg-white font-sans text-ink">
                <Navbar />

                <main className="flex-1">{children}</main>

                <Footer />

                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}