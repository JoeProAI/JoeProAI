import React from 'react';
import Link from 'next/link';

interface AppCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  color?: 'pink' | 'cyan' | 'purple' | 'green';
}

const AppCard: React.FC<AppCardProps> = ({ 
  title, 
  description, 
  icon, 
  href, 
  onClick,
  color = 'cyan' 
}) => {
  const colorClasses = {
    pink: 'border-neon-pink hover:shadow-neon-pink text-neon-pink',
    cyan: 'border-neon-cyan hover:shadow-neon-cyan text-neon-cyan',
    purple: 'border-neon-purple hover:shadow-neon-purple text-neon-purple',
    green: 'border-neon-green hover:shadow-neon-green text-neon-green',
  };

  const Content = () => (
    <div className={`
      relative p-6 h-full
      bg-cyber-light/50 backdrop-blur-md
      border border-opacity-50 ${colorClasses[color].split(' ')[0]}
      rounded-xl transition-all duration-300
      hover:scale-105 hover:-translate-y-1
      ${colorClasses[color].split(' ')[1]}
      group
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className={`mb-4 text-4xl ${colorClasses[color].split(' ')[2]}`}>
          {icon || '🚀'}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient">
          {title}
        </h3>
        
        <p className="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
        
        <div className="mt-auto pt-4 flex items-center text-xs font-mono opacity-60 group-hover:opacity-100 transition-opacity">
          <span className="mr-2">STATUS:</span>
          <span className="text-green-400">ONLINE</span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        <Content />
      </Link>
    );
  }

  return (
    <div onClick={onClick} className="cursor-pointer h-full">
      <Content />
    </div>
  );
};

export default AppCard;
