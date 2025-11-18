import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Communal Story Weaving Studio",
  description: "Weave member stories and experiences into collective narratives using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-900 text-white border-b border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="text-xl font-bold">
                🧵 Story Weaving Studio
              </a>
              <div className="flex gap-6">
                <a href="/fragments" className="hover:text-blue-400 transition">
                  Fragments
                </a>
                <a href="/projects" className="hover:text-blue-400 transition">
                  Projects
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-900 text-gray-400 border-t border-gray-700 py-8">
          <div className="container mx-auto px-4 text-center">
            <p>Communal Story Weaving Studio - Transforming individual voices into collective narratives</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
