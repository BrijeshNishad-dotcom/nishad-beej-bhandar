import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import LanguageProvider from "@/components/LanguageProvider";
import SettingsProvider from "@/components/SettingsProvider";
import { prisma } from "@/lib/db";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const revalidate = 0; // Ensure layout is always dynamic

export async function generateMetadata(): Promise<Metadata> {
  const settingsList = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsList.forEach((s: { key: string; value: string }) => {
    settings[s.key] = s.value;
  });

  const shopName = settings.shopName || "Nishad Beej Bhandar";
  const heroTitle = settings.heroTitle || "अच्छे बीज, अच्छी फसल की शुरुआत";
  const ownerName = settings.ownerName || "Abhay Nishad";
  const mobileNumber = settings.mobileNumber || "6387634500";
  const heroSubtitle = settings.heroSubtitle || "धान, गेहूं, मक्का, सरसों, सब्जियों के बीज, उर्वरक खाद एवं कीटनाशक दवाइयाँ उचित मूल्य पर उपलब्ध हैं।";

  return {
    title: {
      default: `${shopName} - ${heroTitle}`,
      template: `%s | ${shopName}`
    },
    description: heroSubtitle,
    keywords: [shopName, "Seed Store India", "Agriculture Store", ownerName, "Paddy Seeds", "Wheat Seeds", "Fertilizers", "Pesticides", "निषाद बीज भंडार"],
    authors: [{ name: ownerName, url: `tel:${mobileNumber}` }],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nishadbeejbhandar.com"),
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${shopName} - ${heroTitle}`,
      description: heroSubtitle,
      url: "https://nishadbeejbhandar.com",
      siteName: shopName,
      images: [
        {
          url: "/android-chrome-512x512.png",
          width: 512,
          height: 512,
          alt: `${shopName} Logo`,
        },
      ],
      locale: "hi_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${shopName} - ${heroTitle}`,
      description: heroSubtitle,
      images: ["/android-chrome-512x512.png"],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      other: [
        {
          rel: "icon",
          url: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Fetch settings dynamically
  const settingsList = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsList.forEach((s: { key: string; value: string }) => {
    settings[s.key] = s.value;
  });

  return (
    <html
      lang="hi"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#fbfdf9] text-[#1f2c16]" suppressHydrationWarning>
        <AuthProvider>
          <SettingsProvider initialSettings={settings}>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </SettingsProvider>
        </AuthProvider>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
