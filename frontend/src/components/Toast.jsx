import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X, Heart, Trash2 } from 'lucide-react';

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
}

// ─── Individual Toast ─────────────────────────────────────────────────────────
function ToastItem({ id, message, type = 'success', onRemove }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setVisible(true));

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onRemove(id), 300);
        }, 3500);

        return () => clearTimeout(timer);
    }, [id, onRemove]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
        error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
        info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
        like: <Heart className="w-5 h-5 text-red-400 fill-red-400 shrink-0" />,
        delete: <Trash2 className="w-5 h-5 text-red-400 shrink-0" />,
    };

    const borderColors = {
        success: 'border-l-emerald-400',
        error: 'border-l-red-400',
        info: 'border-l-blue-400',
        like: 'border-l-red-400',
        delete: 'border-l-red-400',
    };

    return (
        <div
            className={`
                flex items-center gap-3 min-w-[280px] max-w-[360px] px-4 py-3
                rounded-xl shadow-2xl border border-gray-700/50 border-l-4 ${borderColors[type]}
                bg-slate-900/95 backdrop-blur-lg text-white text-sm
                transition-all duration-300 ease-out
                ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
            `}
        >
            {icons[type]}
            <span className="flex-1 leading-snug">{message}</span>
            <button
                onClick={() => { setVisible(false); setTimeout(() => onRemove(id), 300); }}
                className="text-gray-400 hover:text-white transition ml-1"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const remove = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast container — fixed bottom-right */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto">
                        <ToastItem id={t.id} message={t.message} type={t.type} onRemove={remove} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
