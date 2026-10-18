import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
const inter=localFont({src:"./fonts/InterVariable.woff2",display:"swap",weight:"100 900",style:"normal",variable:"--font-inter",fallback:["ui-sans-serif","system-ui","-apple-system","BlinkMacSystemFont","Segoe UI","sans-serif"]});
export const metadata:Metadata={title:"VSchool · Every school, connected",description:"A configurable school platform, thoughtfully designed for every institution and branch."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en" data-scroll-behavior="smooth" data-vs-theme="forest" className={inter.variable}><body><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>;}
