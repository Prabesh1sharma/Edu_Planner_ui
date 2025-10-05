import './globals.css'
import { ToastProvider } from '../context/ToastContext'

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
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
