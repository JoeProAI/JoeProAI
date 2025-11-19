import Hero from '@/components/Hero';
import NeuralNetworkBG from '@/components/NeuralNetworkBG';

// Force dynamic rendering to avoid build timeout with canvas/animation client components
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <NeuralNetworkBG />
      <Hero />
    </>
  );
}