import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { zapcashJsonLdSchema } from "@/lib/SEO-JSON-schema";
import { OG_IMAGE_URL, SITE_URL } from "@/utils/app-constants";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "ZapCash",
  description: "ZapCash - Your loan application dashboard",
  openGraph: {
    title: "ZapCash",
    description: "ZapCash - Your loan application dashboard",
    url: SITE_URL,
    siteName: "ZapCash",
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL,
        alt: "ZapCash",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZapCash",
    description: "ZapCash - Your loan application dashboard",
    images: [OG_IMAGE_URL],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-N9BFLKFL');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","xsvqmpzd2i");
          `}
        </Script>
        <script
          id="zapcash-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(zapcashJsonLdSchema).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N9BFLKFL"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html: `if (window.location.pathname === '/' && 'scrollRestoration' in history) { history.scrollRestoration = 'manual'; window.scrollTo(0, 0); }`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
