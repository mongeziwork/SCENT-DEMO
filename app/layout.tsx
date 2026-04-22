import type { ReactNode } from "react";

export const metadata = {
  title: "SCENT Demo",
  description: "Demo app with an admin dashboard scaffold.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

