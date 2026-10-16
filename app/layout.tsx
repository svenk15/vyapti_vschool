import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"VSchool · Every school, connected",description:"A configurable school platform, thoughtfully designed for every institution and branch."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>;}
