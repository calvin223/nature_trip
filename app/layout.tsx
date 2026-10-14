import type { ReactNode } from 'react';
import './globals.css';

/* Passes through: the document (<html lang>) is rendered per locale by app/[locale]/layout.tsx,
   and by the two pages that sit outside any locale, the language picker (page.tsx) and the 404. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
