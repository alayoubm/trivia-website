import './globals.css';

export const metadata = {
  title: 'Coffee Trivia ☕',
  description: 'Test your coffee knowledge — mochas, espressos, flat whites and more!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
