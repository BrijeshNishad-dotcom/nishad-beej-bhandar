import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import LanguageProvider from "@/components/LanguageProvider";
import SettingsProvider, { DEFAULT_SETTINGS } from "@/components/SettingsProvider";
import { getSettings } from "@/lib/settings";
import { cookies } from "next/headers";

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
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'hi';
  const isEn = language === 'en';

  const settings = await getSettings();

  const shopName = isEn ? (settings.shopNameEn || DEFAULT_SETTINGS.shopNameEn) : (settings.shopName || DEFAULT_SETTINGS.shopName);
  const heroTitle = isEn ? (settings.heroTitleEn || DEFAULT_SETTINGS.heroTitleEn) : (settings.heroTitle || DEFAULT_SETTINGS.heroTitle);
  const ownerName = isEn ? (settings.ownerNameEn || DEFAULT_SETTINGS.ownerNameEn) : (settings.ownerName || DEFAULT_SETTINGS.ownerName);
  const mobileNumber = settings.mobileNumber || DEFAULT_SETTINGS.mobileNumber;
  const heroSubtitle = isEn ? (settings.heroSubtitleEn || DEFAULT_SETTINGS.heroSubtitleEn) : (settings.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle);

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
          url: settings.logoPath || "/android-chrome-512x512.png",
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
      images: [settings.logoPath || "/android-chrome-512x512.png"],
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
  const cookieStore = await cookies();
  const language = cookieStore.get('language')?.value || 'hi';

  // Fetch settings dynamically using Server Helper
  const settings = await getSettings();

  return (
    <html
      lang={language}
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
