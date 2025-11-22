import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} data-scroll="smooth">
      <body className="scroll-smooth bg-gray-50 antialiased px-6">
        {children}
      </body>
    </html>
  );
}
