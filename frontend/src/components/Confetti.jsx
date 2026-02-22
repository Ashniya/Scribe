import React, { useEffect, useRef } from 'react';

const COLORS = ['#89986d', '#9cab84', '#c5d89d', '#f6f0d7', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa'];

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

export default function Confetti({ active, onDone }) {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Spawn particles
        particles.current = Array.from({ length: 160 }, () => ({
            x: randomBetween(0, canvas.width),
            y: randomBetween(-canvas.height * 0.3, 0),
            w: randomBetween(6, 14),
            h: randomBetween(4, 9),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rot: randomBetween(0, Math.PI * 2),
            rotSpeed: randomBetween(-0.08, 0.08),
            vx: randomBetween(-2, 2),
            vy: randomBetween(2, 6),
            opacity: 1,
        }));

        let startTime = null;
        const DURATION = 2800;

        function draw(ts) {
            if (!startTime) startTime = ts;
            const elapsed = ts - startTime;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let alive = false;
            particles.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.12; // gravity
                p.rot += p.rotSpeed;
                p.opacity = Math.max(0, 1 - elapsed / DURATION);

                if (p.y < canvas.height + 20) alive = true;

                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });

            if (alive && elapsed < DURATION) {
                rafRef.current = requestAnimationFrame(draw);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (onDone) onDone();
            }
        }

        rafRef.current = requestAnimationFrame(draw);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [active]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[99999] pointer-events-none"
        />
    );
}
