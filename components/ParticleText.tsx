'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  originalX: number;
  originalY: number;
  radius: number;
  color: string;
  glowColor: string;
  inFormation: boolean;
}

const COLORS = [
  { main: '#00d4ff', glow: 'rgba(0, 212, 255, 0.6)' },   // Cyan
  { main: '#0066ff', glow: 'rgba(0, 102, 255, 0.6)' },   // Blue
  { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)' },  // Purple
  { main: '#ec4899', glow: 'rgba(236, 72, 153, 0.6)' },  // Pink
  { main: '#10b981', glow: 'rgba(16, 185, 129, 0.6)' },  // Green
  { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)' },  // Orange
];

const PHRASES = [
  'BUILD',
  'SHIP',
  'CODE',
  'DEPLOY',
  'SCALE',
  'EXECUTE',
  'INNOVATE',
  'ACCELERATE',
];

export default function ParticleText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const phraseIndexRef = useRef(0);
  const stateRef = useRef<'forming' | 'holding' | 'dissolving'>('forming');
  const timerRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Initialize particles in random positions
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 800; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          targetX: 0,
          targetY: 0,
          originalX: Math.random() * canvas.width,
          originalY: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          color: color.main,
          glowColor: color.glow,
          inFormation: false,
        });
      }
    };
    initParticles();

    // Create text particles from canvas text
    const getTextParticles = (text: string): { x: number; y: number }[] => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return [];

      // Set up temporary canvas for text
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      
      // Draw text
      const fontSize = Math.min(canvas.width * 0.15, 150);
      tempCtx.font = `900 ${fontSize}px Arial`;
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      tempCtx.fillStyle = 'white';
      tempCtx.fillText(text, canvas.width / 2, canvas.height / 2);

      // Get pixel data
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const pixels = imageData.data;
      const positions: { x: number; y: number }[] = [];

      // Sample pixels (skip some for performance)
      const skip = 4;
      for (let y = 0; y < tempCanvas.height; y += skip) {
        for (let x = 0; x < tempCanvas.width; x += skip) {
          const index = (y * tempCanvas.width + x) * 4;
          const alpha = pixels[index + 3];
          
          if (alpha > 128) {
            positions.push({ x, y });
          }
        }
      }

      return positions;
    };

    // Form text with particles
    const formText = (text: string) => {
      const textPositions = getTextParticles(text);
      
      // Assign particles to text positions
      const particlesToUse = particlesRef.current.slice(0, Math.min(textPositions.length, particlesRef.current.length));
      
      particlesToUse.forEach((particle, i) => {
        if (i < textPositions.length) {
          particle.targetX = textPositions[i].x;
          particle.targetY = textPositions[i].y;
          particle.inFormation = true;
        }
      });
      
      // Reset others to random
      particlesRef.current.slice(textPositions.length).forEach(particle => {
        particle.inFormation = false;
        particle.targetX = particle.originalX;
        particle.targetY = particle.originalY;
      });
    };

    // Dissolve text back to random
    const dissolveText = () => {
      particlesRef.current.forEach(particle => {
        particle.inFormation = false;
        particle.targetX = Math.random() * canvas.width;
        particle.targetY = Math.random() * canvas.height;
        particle.originalX = particle.targetX;
        particle.originalY = particle.targetY;
      });
    };

    // Start with first phrase
    formText(PHRASES[0]);
    stateRef.current = 'forming';

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update state timer
      timerRef.current++;

      // State machine
      if (stateRef.current === 'forming' && timerRef.current > 120) {
        // After 2 seconds of forming, hold
        stateRef.current = 'holding';
        timerRef.current = 0;
      } else if (stateRef.current === 'holding' && timerRef.current > 180) {
        // After 3 seconds of holding, dissolve
        stateRef.current = 'dissolving';
        timerRef.current = 0;
        dissolveText();
      } else if (stateRef.current === 'dissolving' && timerRef.current > 120) {
        // After 2 seconds of dissolving, form next phrase
        phraseIndexRef.current = (phraseIndexRef.current + 1) % PHRASES.length;
        formText(PHRASES[phraseIndexRef.current]);
        stateRef.current = 'forming';
        timerRef.current = 0;
      }

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Move toward target
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (particle.inFormation && dist > 1) {
          // Strong attraction to formation position
          particle.vx += dx * 0.01;
          particle.vy += dy * 0.01;
        } else if (!particle.inFormation) {
          // Weak attraction to random position
          particle.vx += dx * 0.002;
          particle.vy += dy * 0.002;
        }

        // Apply damping
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.glowColor;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw connections between nearby particles
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            const opacity = (80 - dist) / 80;
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.2})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at top, #001020 0%, #000000 50%, #000000 100%)' }}
    />
  );
}
