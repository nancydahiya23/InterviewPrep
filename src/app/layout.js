import "./globals.css";
import Header from "@/components/header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#020617] text-white">
        <Header />
        {children}
      </body>
    </html>
  );
}