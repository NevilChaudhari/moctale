import './globals.css'

import 'bootstrap-icons/font/bootstrap-icons.css';

import TopProgressBar from './TopProgressBar';

import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopProgressBar />
        {children}
      </body>
    </html>
  )
}
