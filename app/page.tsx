import Hero from '@/components/Hero';
import AnimatedBackground from '@/components/AnimatedBackground';

// Force dynamic rendering to avoid build timeout with canvas/animation client components
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <Hero />
    </>
  );
}