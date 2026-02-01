"use client";

import { Inter } from "next/font/google";
import GlobalHeader from "./GlobalHeader.js";

const inter = Inter({ subsets: ["latin"] });

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

export default function App({ children }) {
  return (
    <RootLayout>
      <GlobalHeader>{children}</GlobalHeader>
    </RootLayout>
  );
}
