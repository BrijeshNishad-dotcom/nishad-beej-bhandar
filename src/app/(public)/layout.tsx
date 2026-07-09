import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import MobileBrandBanner from "@/components/MobileBrandBanner";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Mobile-only brand banner — hidden on sm+ screens */}
        <MobileBrandBanner />
        {children}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

