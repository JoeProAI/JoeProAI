'use client';

import { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

export default function NeuralNetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize nodes
    const nodeCount = prefersReducedMotion ? 30 : 50;
    const initialNodes: Node[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      initialNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.2 : 0.5),
        vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.2 : 0.5),
        connections: []
      });
    }
    setNodes(initialNodes);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (nodes.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Mouse interaction - attract nodes to cursor
        const dx = mousePos.current.x - node.x;
        const dy = mousePos.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150 && !prefersReducedMotion) {
          node.vx += dx * 0.0001;
          node.vy += dy * 0.0001;
        }

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));

        // Damping
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i >= j) return;
          
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.5;
            const gradient = ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y);
            gradient.addColorStop(0, `rgba(255, 16, 240, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(0, 240, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(176, 38, 255, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });

        // Draw node
        const mouseDist = Math.sqrt(
          Math.pow(mousePos.current.x - node.x, 2) + 
          Math.pow(mousePos.current.y - node.y, 2)
        );
        const nodeSize = mouseDist < 100 ? 4 + (100 - mouseDist) / 20 : 3;
        
        const nodeGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize * 2);
        nodeGradient.addColorStop(0, 'rgba(0, 240, 255, 1)');
        nodeGradient.addColorStop(0.5, 'rgba(255, 16, 240, 0.8)');
        nodeGradient.addColorStop(1, 'rgba(176, 38, 255, 0)');
        
        ctx.fillStyle = nodeGradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect on hover
        if (mouseDist < 50) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#00F0FF';
          ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-gray">
        <div className="absolute inset-0 cyber-grid opacity-20" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-cyber-darker"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}