import type React from "react"
import type { Metadata } from "next"
import { Outfit, Plus_Jakarta_Sans } from "next/font/google"
import { Geist } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-outfit",
    display: "swap",
})

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-plus-jakarta",
    display: "swap",
})

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
    display: "swap",
})

export const metadata: Metadata = {
    title: "PlantBot - Your Smart Plant Companion",
    description: "AI-powered plant identification and care assistant",
    generator: "v0.app",
}

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`font-sans ${geistSans.variable} ${outfit.variable} ${plusJakarta.variable} antialiased`}>
                <Suspense fallback={null}>{children}</Suspense>
            </body>
        </html>
    )
}
