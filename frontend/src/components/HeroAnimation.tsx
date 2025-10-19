'use client';

import { useEffect, useRef } from 'react';

const HeroAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas boyutlarını ayarla
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animasyon objeleri
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;
      life: number;
      maxLife: number;
    }> = [];


    // Parçacık oluştur
    const createParticle = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 3 + 1,
        color: `hsl(${200 + Math.random() * 60}, 60%, 60%)`,
        opacity: Math.random() * 0.3 + 0.2,
        life: 0,
        maxLife: Math.random() * 200 + 100
      });
    };


    // Dünya haritası çiz
    const drawWorldMap = () => {
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      
      // Daha sakin dünya haritası çizimi
      ctx.beginPath();
      // Avrupa
      ctx.arc(canvas.width * 0.6, canvas.height * 0.4, 100, 0, Math.PI * 2);
      // Amerika
      ctx.arc(canvas.width * 0.2, canvas.height * 0.5, 80, 0, Math.PI * 2);
      // Asya
      ctx.arc(canvas.width * 0.8, canvas.height * 0.3, 90, 0, Math.PI * 2);
      // Afrika
      ctx.arc(canvas.width * 0.5, canvas.height * 0.7, 70, 0, Math.PI * 2);
      // Avustralya
      ctx.arc(canvas.width * 0.9, canvas.height * 0.8, 50, 0, Math.PI * 2);
      
      ctx.stroke();
      
      // İç kısımları doldur
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      
      ctx.restore();
    };


    // Animasyon döngüsü
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dünya haritasını çiz
      drawWorldMap();
      
      // Parçacıkları güncelle ve çiz
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;
        particle.opacity = (1 - particle.life / particle.maxLife) * 0.3;
        
        if (particle.life >= particle.maxLife || particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
          particles.splice(i, 1);
          continue;
        }
        
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      
      // Yeni parçacık oluştur - çok az sık
      if (Math.random() < 0.05) {
        createParticle(Math.random() * canvas.width, Math.random() * canvas.height);
      }
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default HeroAnimation;
