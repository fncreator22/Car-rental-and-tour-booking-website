import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import Notifications from './components/Notifications'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tripura Car Rental & Tours',
  description: 'Discover Tripura with our premium car rental and tour services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Notifications />
        <Footer />
      </body>
    </html>
  )
}

