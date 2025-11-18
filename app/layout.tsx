import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Survey Form - Typeform Style',
  description: 'A beautiful survey form with Typeform-inspired design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
