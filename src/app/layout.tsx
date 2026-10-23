import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import {StoryAudioProvider} from "../components/StoryAudio";
export const metadata: Metadata = {
  title: "CHOG 1969 — the world forgot",
  description: "An interactive manga about the Chogs erased from history.",
};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body><StoryAudioProvider>
    <header className="site-header"><Link href="/" className="wordmark">CHOG 1969</Link>
      <nav aria-label="Main navigation"><Link href="/chapter/1">read the story</Link><Link href="/archive">the seals</Link></nav>
      <span className="header-status">the world forgot.</span>
    </header>
    <main>{children}</main>
    <footer className="footer"><span>an independent chogathon story experiment</span><span>not official chog canon</span></footer>
  </StoryAudioProvider></body></html>;
}
