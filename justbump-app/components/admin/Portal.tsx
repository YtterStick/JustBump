'use client';

import { ReactNode, useEffect, useState } from 'react';
// @ts-ignore
import { createPortal } from 'react-dom';

interface PortalProps {
    children: ReactNode;
}

export default function Portal({ children }: PortalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            <div className="pointer-events-auto contents">
                {children}
            </div>
        </div>,
        document.body
    );
}
