import "./globals.css";

import "bootstrap-icons/font/bootstrap-icons.css";
import TopProgressBar from "./(main)/TopProgressBar";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <TopProgressBar />
        {children}
      </body>
    </html>
  );
}
