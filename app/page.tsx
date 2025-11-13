import Hero from '@/components/Hero';
import NeuralNetCanvas from '@/components/NeuralNetCanvas';

// Force dynamic rendering to avoid build timeout with canvas/animation client components
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="relative">
      <NeuralNetCanvas />
      <Hero />
    </main>
  );
}