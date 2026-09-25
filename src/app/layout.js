import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ProductProvider } from '@/context/ProductContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'NexusStore | Enterprise Product Management System',
  description:
    'Comprehensive e-commerce product management dashboard powered by Next.js, featuring real-time catalog analytics, advanced filtering, and CRUD operations.',
  keywords: ['e-commerce', 'product management', 'nextjs', 'dashboard', 'inventory'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <AuthProvider>
            <ProductProvider>
              <div className="app-container">
                <Navbar />
                <main className="main-content">{children}</main>
                <Footer />
              </div>
            </ProductProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
