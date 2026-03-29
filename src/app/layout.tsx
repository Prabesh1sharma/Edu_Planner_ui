import './globals.css'
import { ToastProvider } from '../context/ToastContext'
import Footer from '../components/Footer'

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
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ToastProvider>
          <div style={{ flex: 1 }}>
            {children}
          </div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
