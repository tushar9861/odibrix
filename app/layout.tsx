import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { FloatingActionPanel } from "@/components/ui/floating-action-panel"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://odibrix.com"),
  title: {
    default: "OdiBrix - Premium Real Estate in Odisha | Homes, Villas, Commercial Properties",
    template: "%s | OdiBrix Real Estate",
  },
  description:
    "Discover luxury properties in Baleshwar and across Odisha. Expert consultancy, 3D virtual tours, floor plans, and personalized property solutions for apartments, villas, commercial spaces, and land.",
  keywords: [
    "real estate Odisha",
    "property Baleshwar",
    "apartments Bhubaneswar",
    "villas Odisha",
    "commercial property",
    "land for sale",
    "floor plan consultancy",
    "3D property tour",
    "OdiBrix",
    "premium real estate",
    "property investment Odisha",
  ],
  authors: [{ name: "OdiBrix Real Estate", url: "https://odibrix.com" }],
  creator: "OdiBrix",
  publisher: "OdiBrix Real Estate",
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
  icons: {
    icon: "/images/odibrix-logo.jpg",
    shortcut: "/images/odibrix-logo.jpg",
    apple: "/images/odibrix-logo.jpg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://odibrix.com",
    siteName: "OdiBrix Real Estate",
    title: "OdiBrix - Premium Real Estate in Odisha",
    description:
      "Discover luxury properties in Baleshwar and across Odisha. Expert consultancy, 3D virtual tours, and personalized property solutions.",
    images: [
      {
        url: "/images/odibrix-logo.jpg",
        width: 800,
        height: 800,
        alt: "OdiBrix Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OdiBrix - Premium Real Estate in Odisha",
    description: "Discover luxury properties in Baleshwar and across Odisha.",
    images: ["/images/odibrix-logo.jpg"],
    creator: "@odibrix",
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "Real Estate",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1a365d" },
    { media: "(prefers-color-scheme: dark)", color: "#1a365d" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "OdiBrix",
              description: "Premium real estate services in Odisha",
              url: "https://odibrix.com",
              logo: "https://odibrix.com/images/odibrix-logo.jpg",
              telephone: "+91-8763022010",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Station Road",
                addressLocality: "Baleshwar",
                addressRegion: "Odisha",
                postalCode: "756001",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "21.4934",
                longitude: "86.9135",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "09:00",
                closes: "18:00",
              },
              priceRange: "₹₹₹",
              areaServed: ["Baleshwar", "Bhubaneswar", "Cuttack", "Odisha"],
              sameAs: ["https://facebook.com/odibrix", "https://instagram.com/odibrix", "https://twitter.com/odibrix"],
            }),
          }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        {children}
        <FloatingActionPanel />
        <Analytics />
      </body>
    </html>
  )
}
