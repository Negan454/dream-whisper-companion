
import React, { useEffect, useRef } from 'react';

interface ParticlesProps {
  quantity?: number;
  className?: string;
}

const Particles = ({ quantity = 20, className }: ParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const createParticle = () => {
      const particle = document.createElement('div');
      
      // Random size
      const size = Math.random() * 15 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random animation duration
      particle.style.animationDuration = `${Math.random() * 15 + 15}s`;
      
      // Random animation delay
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      // Random opacity
      particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
      
      // Add classes
      particle.classList.add('particle');
      
      container.appendChild(particle);
      
      // Remove particle after animation completes
      setTimeout(() => {
        particle.remove();
        createParticle();
      }, (parseFloat(particle.style.animationDuration) * 1000) + (parseFloat(particle.style.animationDelay) * 1000));
    };
    
    // Create initial particles
    for (let i = 0; i < quantity; i++) {
      createParticle();
    }
    
    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [quantity]);

  return (
    <div ref={containerRef} className={`particles-container ${className || ''}`}></div>
  );
};

export default Particles;
