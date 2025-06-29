import './globals.css'

export const metadata = {
  title: 'EduPlanner',
  description: 'Plan your educational journey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
