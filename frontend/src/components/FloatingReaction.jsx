import React, { useEffect, useState } from 'react';
import { Heart, Bookmark } from 'lucide-react';

/**
 * FloatingReaction
 * Shows an animated floating icon popup in the bottom-right corner.
 * type: 'like' | 'save'
 * active: boolean — trigger a new animation each time this flips to true
 */
export default function FloatingReaction({ type, active }) {
    const [key, setKey] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!active) return;
        // Remount the animation element by incrementing key
        setKey(k => k + 1);
        setVisible(true);
        const t = setTimeout(() => setVisible(false), 2100);
        return () => clearTimeout(t);
    }, [active]);

    if (!visible) return null;

    const isLike = type === 'like';

    return (
        <div
            key={key}
            className="fixed bottom-24 right-8 z-[9998] pointer-events-none flex flex-col items-center gap-1 animate-float-up-out"
        >
            {/* Icon bubble */}
            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center shadow-2xl
                ${isLike
                    ? 'bg-gradient-to-br from-red-500 to-rose-400'
                    : 'bg-gradient-to-br from-scribe-green to-scribe-sage'
                }
            `}>
                {isLike
                    ? <Heart className="w-8 h-8 text-white fill-white" />
                    : <Bookmark className="w-8 h-8 text-white fill-white" />
                }
            </div>

            {/* Label */}
            <span className={`
                text-xs font-bold px-3 py-1 rounded-full shadow-lg text-white
                ${isLike ? 'bg-red-500' : 'bg-scribe-green'}
            `}>
                {isLike ? 'Liked! ❤️' : 'Saved! 🔖'}
            </span>
        </div>
    );
}
