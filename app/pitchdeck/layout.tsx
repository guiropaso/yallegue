import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pitch Deck — Ya Llegué! | Inversión Pre-Seed 2026',
  description:
    'Marketplace de servicios a domicilio en El Salvador. Buscamos $125,000 USD por 10% de equity. App en producción, 250+ proveedores reclutados.',
}

export default function PitchDeckLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
