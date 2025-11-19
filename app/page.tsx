import Hero from '@/components/Hero';

export default function Home() {
  return (
    <div className="relative min-h-screen" style={{
      background: 'linear-gradient(135deg, #001030 0%, #000510 100%)'
    }}>
      <Hero />
    </div>
  );
}