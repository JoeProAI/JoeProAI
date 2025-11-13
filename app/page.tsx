import Hero from '@/components/Hero';
import NeuralNetCanvas from '@/components/NeuralNetCanvas';

export default function Home() {
  return (
    <main className="relative">
      <NeuralNetCanvas />
      <Hero />
    </main>
  );
}