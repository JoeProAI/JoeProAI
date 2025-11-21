'use client';

import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  attractorX: number;
  attractorY: number;
}

const COLORS = [
  { main: '#00d4ff', glow: 'rgba(0, 212, 255, 0.6)' },
  { main: '#0066ff', glow: 'rgba(0, 102, 255, 0.6)' },
  { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)' },
  { main: '#ec4899', glow: 'rgba(236, 72, 153, 0.6)' },
  { main: '#10b981', glow: 'rgba(16, 185, 129, 0.6)' },
  { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)' },
];

const ParticleText: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Initialize nodes with gravitational attractors
    const initNodes = () => {
      const nodeCount = 120;
      for (let i = 0; i < nodeCount; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const attractorX = Math.random() * canvas.width;
        const attractorY = Math.random() * canvas.height;
        
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1.5,
          color: color.main,
          glowColor: color.glow,
          attractorX,
          attractorY,
        });
      }
    };
    initNodes();

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      // Fade effect for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodesRef.current.forEach((node) => {
        // Mouse attraction (strong)
        const mouseDx = mouseRef.current.x - node.x;
        const mouseDy = mouseRef.current.y - node.y;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        if (mouseDist < 250 && mouseDist > 0) {
          const mouseForce = (250 - mouseDist) / 250;
          node.vx += (mouseDx / mouseDist) * mouseForce * 0.5;
          node.vy += (mouseDy / mouseDist) * mouseForce * 0.5;
        }

        // Gravitational attractor (weak pull back)
        const attractorDx = node.attractorX - node.x;
        const attractorDy = node.attractorY - node.y;
        node.vx += attractorDx * 0.0005;
        node.vy += attractorDy * 0.0005;

        // Apply velocity
        node.x += node.vx;
        node.y += node.vy;

        // Damping
        node.vx *= 0.95;
        node.vy *= 0.95;

        // Wrap around edges
        if (node.x < 0) node.x = canvas.width;
        if (node.x > canvas.width) node.x = 0;
        if (node.y < 0) node.y = canvas.height;
        if (node.y > canvas.height) node.y = 0;

        // Draw node
        ctx.shadowBlur = 15;
        ctx.shadowColor = node.glowColor;
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw connections between nearby nodes
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodesRef.current.length; i++) {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const n1 = nodesRef.current[i];
          const n2 = nodesRef.current[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (150 - dist) / 150;
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.2})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
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
};

export default ParticleText;
