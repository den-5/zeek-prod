// src/app/layout.js
import Providers from "./_components/Providers";
import RootLayout from "./_components/RootLayout";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: "Zeek | Realtime Gaming Platform",
  description: "High-performance multiplayer gaming engine utilizing WebSockets.",
};

export default function App({ children }) {
  return (
    <Providers>
      <RootLayout>{children}</RootLayout>
    </Providers>
  );
}
