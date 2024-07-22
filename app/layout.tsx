import { SocketProvider } from "../contexts/SocketContext";

export const metadata = {
  title: {
    template: "%s | Simple Chat",
    default: "Simple Chat",
  },
  description: "Simple Chat with anon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SocketProvider>
        <body>{children}</body>
      </SocketProvider>
    </html>
  );
}
