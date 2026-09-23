export const metadata = {
  title: "LiveScore",
  description: "Live cricket scores and match updates",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
