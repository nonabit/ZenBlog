import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    targetOpacity: number;
    rotation: number;
    rotationSpeed: number;
}

export default function SiliconBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            // 粒子数量适中，保持极简感
            const count = Math.floor((width * height) / 25000);

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 4 + 2, // 再次增大尺寸
                    speedX: (Math.random() - 0.5) * 0.4,
                    speedY: (Math.random() - 0.5) * 0.4,
                    opacity: Math.random() * 0.5 + 0.1,
                    targetOpacity: Math.random() * 0.5 + 0.1,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.02
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                // ... (movement logic remains same)
                p.x += p.speedX;
                p.y += p.speedY;
                p.rotation += p.rotationSpeed;

                if (p.x < 0 || p.x > width) p.speedX *= -1;
                if (p.y < 0 || p.y > height) p.speedY *= -1;

                if (Math.abs(p.opacity - p.targetOpacity) < 0.01) {
                    p.targetOpacity = Math.random() * 0.6 + 0.1;
                }
                const opacityDiff = p.targetOpacity - p.opacity;
                p.opacity += opacityDiff * 0.05;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);

                // 视觉调整：颜色更深
                const isDark = document.documentElement.classList.contains('dark');
                // 浅色模式：接近纯黑 (30,30,30)；深色模式：稍微亮一点的灰 (220,220,220)
                const color = isDark ? '220, 220, 220' : '30, 30, 30';

                ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[1]"
            style={{ opacity: 1 }}
        />
    );
}
