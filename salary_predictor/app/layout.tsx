

import { SideBar } from "@/components/SideBar";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
    <html lang="en">
      <body>
        <SideBar />
        {children}
      </body>
    </html>

    </SidebarProvider>
  );
}
