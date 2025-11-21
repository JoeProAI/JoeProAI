"use client";

import React, { useState } from 'react';

const NanoBanana = () => {
    const [count, setCount] = useState(0);
    const [isDancing, setIsDancing] = useState(false);

    const handleClick = () => {
        setCount(prev => prev + 1);
        setIsDancing(true);
        setTimeout(() => setIsDancing(false), 500);
    };

    return (
        <div className="flex flex-col items-center justify-center h-[400px] w-full bg-yellow-900/10 border border-neon-yellow/30 rounded-xl overflow-hidden relative">
            <div className="absolute top-4 right-4 text-neon-yellow font-mono text-xl font-bold">
                SCORE: {count}
            </div>

            <div
                onClick={handleClick}
                className={`
          cursor-pointer select-none text-9xl transition-transform duration-100
          ${isDancing ? 'scale-125 rotate-12' : 'hover:scale-110'}
        `}
                style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 0, 0.5))' }}
            >
                🍌
            </div>

            <p className="mt-8 text-neon-yellow/80 font-mono text-sm animate-pulse">
                CLICK THE NANO BANANA
            </p>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-neon-yellow/20">
                <div
                    className="h-full bg-neon-yellow transition-all duration-300"
                    style={{ width: `${Math.min(count, 100)}%` }}
                />
            </div>
        </div>
    );
};

export default NanoBanana;
