'use client';

import { useEffect, useState } from 'react';

// Fixed node positions (deterministic, no random on render)
const FIXED_NODES = Array.from({ length: 25 }, (_, i) => {
  // Use index-based seed for consistent positions
  const seed = i * 123.456;
  return {
    id: i,
    x: ((seed * 9301 + 49297) % 233280) / 2332.8,
    y: ((seed * 4253 + 15731) % 233280) / 2332.8,
    size: 15 + ((seed * 7919) % 30) / 5,  // Much bigger: 15-21px
  };
});

export default function NeuralNetworkBG() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ 
      background: 'linear-gradient(135deg, #000510 0%, #001030 100%)'
    }}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        <defs>
          {/* Blue glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Cyan glow filter */}
          <filter id="cyanGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Gradient for connections */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#0066ff', stopOpacity: 0.6 }} />
            <stop offset="50%" style={{ stopColor: '#00d4ff', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#0066ff', stopOpacity: 0.6 }} />
          </linearGradient>

          {/* Radial gradient for nodes */}
          <radialGradient id="nodeGradient">
            <stop offset="0%" style={{ stopColor: '#00d4ff', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#0066ff', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#0052cc', stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Draw connections */}
        {FIXED_NODES.map((node, i) => (
          FIXED_NODES.slice(i + 1).map((otherNode, j) => {
            const dx = otherNode.x - node.x;
            const dy = otherNode.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only draw if nodes are close enough
            if (distance < 30) {
              const opacity = (1 - distance / 30) * 0.9;
              
              return (
                <line
                  key={`${i}-${j}`}
                  x1={node.x}
                  y1={node.y}
                  x2={otherNode.x}
                  y2={otherNode.y}
                  stroke="url(#connectionGradient)"
                  strokeWidth="0.3"
                  opacity={opacity}
                  filter="url(#glow)"
                />
              );
            }
            return null;
          })
        ))}

        {/* Draw nodes */}
        {FIXED_NODES.map((node) => {
          // Calculate distance from mouse
          const dx = mousePos.x - node.x;
          const dy = mousePos.y - node.y;
          const distFromMouse = Math.sqrt(dx * dx + dy * dy);
          
          // Scale based on mouse proximity
          const isNearMouse = distFromMouse < 25;
          const scale = isNearMouse ? 2 : 1;
          const glowFilter = isNearMouse ? 'url(#cyanGlow)' : 'url(#glow)';

          return (
            <g key={node.id}>
              {/* Outer glow ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * 4 * scale}
                fill="url(#nodeGradient)"
                opacity="0.7"
              />
              
              {/* Main node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * scale}
                fill="#00d4ff"
                stroke="#0066ff"
                strokeWidth="0.5"
                filter={glowFilter}
                opacity="1"
              />
              
              {/* Core highlight */}
              <circle
                cx={node.x - 0.5}
                cy={node.y - 0.5}
                r={node.size * 0.4 * scale}
                fill="#ffffff"
                opacity="0.6"
              />
            </g>
          );
        })}

        {/* Animated scan lines */}
        <g opacity="0.3">
          <line x1="0" y1="20" x2="100" y2="20" stroke="#00d4ff" strokeWidth="0.1">
            <animate
              attributeName="y1"
              values="20;80;20"
              dur="8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y2"
              values="20;80;20"
              dur="8s"
              repeatCount="indefinite"
            />
          </line>
          <line x1="0" y1="50" x2="100" y2="50" stroke="#0066ff" strokeWidth="0.1">
            <animate
              attributeName="y1"
              values="50;10;50"
              dur="12s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y2"
              values="50;10;50"
              dur="12s"
              repeatCount="indefinite"
            />
          </line>
        </g>
      </svg>
    </div>
  );
}
