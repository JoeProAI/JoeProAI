'use client';

import { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
}

const COLORS = [
  { main: '#00d4ff', glow: 'rgba(0, 212, 255' }, // Cyan
  { main: '#0066ff', glow: 'rgba(0, 102, 255' }, // Blue
  { main: '#a855f7', glow: 'rgba(168, 85, 247' }, // Purple
  { main: '#ec4899', glow: 'rgba(236, 72, 153' }, // Pink
  { main: '#10b981', glow: 'rgba(16, 185, 129' }, // Green
  { main: '#f59e0b', glow: 'rgba(245, 158, 11' }, // Orange
];

export default function NeuralNetworkInteractive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const nodesRef = useRef<Node[]>([]);
  const animationRef = useRef<number>();

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

    // Initialize nodes with random colors
    if (nodesRef.current.length === 0) {
      for (let i = 0; i < 60; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 3 + 2,
          color: color.main,
          glowColor: color.glow,
        });
      }
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 16, 48, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Mouse attraction
        const dx = mousePos.x - node.x;
        const dy = mousePos.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          node.x += dx * force * 0.03;
          node.y += dy * force * 0.03;
        }

        // Draw connections to nearby nodes
        nodes.slice(i + 1).forEach((otherNode) => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.5;
            
            // Check if line passes near mouse
            const mouseDistToLine = distanceToLine(
              mousePos.x, mousePos.y,
              node.x, node.y,
              otherNode.x, otherNode.y
            );
            
            const glowMultiplier = mouseDistToLine < 50 ? 1.5 : 1;
            
            // Use blended color from both nodes
            const gradient = ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y);
            gradient.addColorStop(0, `${node.glowColor}, ${opacity * glowMultiplier})`);
            gradient.addColorStop(1, `${otherNode.glowColor}, ${opacity * glowMultiplier})`);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = mouseDistToLine < 50 ? 0.8 : 0.4;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });

        // Draw node
        const mouseDist = Math.sqrt(
          Math.pow(mousePos.x - node.x, 2) + Math.pow(mousePos.y - node.y, 2)
        );
        
        const scale = mouseDist < 100 ? 1 + (100 - mouseDist) / 100 : 1;
        const glowSize = mouseDist < 100 ? 20 : 10;

        // Glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * scale * 3
        );
        gradient.addColorStop(0, `${node.glowColor}, 0.8)`);
        gradient.addColorStop(0.5, `${node.glowColor}, 0.4)`);
        gradient.addColorStop(1, `${node.glowColor}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * scale * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = node.color;
        ctx.shadowBlur = glowSize;
        ctx.shadowColor = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePos.x, mousePos.y]);

  // Helper function to calculate distance from point to line
  function distanceToLine(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'linear-gradient(135deg, #001030 0%, #000510 100%)' }}
    />
  );
}
