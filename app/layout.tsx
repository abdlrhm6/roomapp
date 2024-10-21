import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/auth";

import "./globals.css";



export const metadata = {
  title: "Roomat",
  description: "Roomat",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
