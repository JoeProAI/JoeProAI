'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  radius: number;
  color: string;
  glowColor: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const COLORS = [
  { main: '#00d4ff', glow: 'rgba(0, 212, 255, 0.6)' },
  { main: '#0066ff', glow: 'rgba(0, 102, 255, 0.6)' },
  { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)' },
  { main: '#ec4899', glow: 'rgba(236, 72, 153, 0.6)' },
  { main: '#10b981', glow: 'rgba(16, 185, 129, 0.6)' },
  { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)' },
];

const WORDS = ['SHIP', 'BUILD', 'FAST', 'AI', 'CODE', 'DEPLOY', 'SCALE', 'TRAIN'];

export default function ParticleText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Create text nodes along letter outlines (sparse, not filled)
    const createWordNodes = (text: string, centerX: number, centerY: number): Particle[] => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return [];

      const fontSize = 60;
      tempCtx.font = `900 ${fontSize}px Arial`;
      const metrics = tempCtx.measureText(text);
      const textWidth = metrics.width;
      const textHeight = fontSize;

      tempCanvas.width = textWidth + 20;
      tempCanvas.height = textHeight + 20;

      tempCtx.font = `900 ${fontSize}px Arial`;
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      tempCtx.strokeStyle = 'white';
      tempCtx.lineWidth = 3;
      tempCtx.strokeText(text, tempCanvas.width / 2, tempCanvas.height / 2);

      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const pixels = imageData.data;
      const edgePixels: { x: number; y: number }[] = [];

      // Find edge pixels only (outline)
      for (let y = 1; y < tempCanvas.height - 1; y++) {
        for (let x = 1; x < tempCanvas.width - 1; x++) {
          const index = (y * tempCanvas.width + x) * 4;
          const alpha = pixels[index + 3];

          if (alpha > 128) {
            // Check if this is an edge pixel (has transparent neighbor)
            const neighbors = [
              pixels[((y - 1) * tempCanvas.width + x) * 4 + 3],
              pixels[((y + 1) * tempCanvas.width + x) * 4 + 3],
              pixels[(y * tempCanvas.width + (x - 1)) * 4 + 3],
              pixels[(y * tempCanvas.width + (x + 1)) * 4 + 3],
            ];
            if (neighbors.some(n => n < 128)) {
              edgePixels.push({ x, y });
            }
          }
        }
      }

      // Sample nodes along the outline (sparse)
      const particles: Particle[] = [];
      const nodeSpacing = 15; // Distance between nodes - more spacing for clearer wireframe
      const sampledNodes: { x: number; y: number }[] = [];

      for (const pixel of edgePixels) {
        // Only add if far enough from existing nodes
        const tooClose = sampledNodes.some(node => {
          const dx = node.x - pixel.x;
          const dy = node.y - pixel.y;
          return Math.sqrt(dx * dx + dy * dy) < nodeSpacing;
        });

        if (!tooClose) {
          sampledNodes.push(pixel);
          const color = COLORS[Math.floor(Math.random() * COLORS.length)];
          const actualX = centerX - tempCanvas.width / 2 + pixel.x;
          const actualY = centerY - tempCanvas.height / 2 + pixel.y;
          particles.push({
            x: actualX,
            y: actualY,
            vx: 0,
            vy: 0,
            targetX: actualX,
            targetY: actualY,
            radius: Math.random() * 1 + 2.5,
            color: color.main,
            glowColor: color.glow,
          });
        }
      }

      return particles;
    };

    // Initialize multiple word formations scattered across page
    const initParticles = () => {
      const wordCount = 6;
      const margin = 150;

      for (let i = 0; i < wordCount; i++) {
        const word = WORDS[i % WORDS.length];
        const x = margin + Math.random() * (canvas.width - margin * 2);
        const y = margin + Math.random() * (canvas.height - margin * 2);
        const wordNodes = createWordNodes(word, x, y);
        particlesRef.current.push(...wordNodes);
      }
    };
    initParticles();

    // Initialize neural network nodes
    const initNodes = () => {
      for (let i = 0; i < 80; i++) {
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)].main,
        });
      }
    };
    initNodes();

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes with mouse interaction
      nodesRef.current.forEach((node) => {
        // Mouse attraction
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200;
          node.vx += (dx / dist) * force * 0.3;
          node.vy += (dy / dist) * force * 0.3;
        }

        // Apply velocity
        node.x += node.vx;
        node.y += node.vy;

        // Damping
        node.vx *= 0.95;
        node.vy *= 0.95;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));

        // Draw node
        ctx.shadowBlur = 10;
        ctx.shadowColor = node.color;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw connections between nodes
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const n1 = nodesRef.current[i];
          const n2 = nodesRef.current[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const opacity = (120 - dist) / 120;
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.15})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles (word formations - outline nodes)
      particlesRef.current.forEach((particle) => {
        // Gentle drift toward target
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        particle.vx += dx * 0.001;
        particle.vy += dy * 0.001;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Draw particle node
        ctx.shadowBlur = 12;
        ctx.shadowColor = particle.glowColor;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw connections between word nodes (to show letter shapes)
      ctx.lineWidth = 1;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect nodes that are close (part of same letter)
          if (dist < 25) {
            ctx.strokeStyle = `${p1.color}60`; // Semi-transparent, lighter for more spacing
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{
        background: 'radial-gradient(ellipse at top, #001020 0%, #000000 50%, #000000 100%)',
      }}
    />
  );
}
