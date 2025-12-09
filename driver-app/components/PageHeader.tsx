"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: React.ReactNode;
    variant?: 'default' | 'ghost';
}

export function PageHeader({ title, showBack = true, onBack, rightAction, variant = 'default' }: PageHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const isGhost = variant === 'ghost';

    return (
        <div className={`sticky top-0 z-30 px-4 h-14 flex items-center justify-between transition-colors ${isGhost
            ? 'bg-transparent text-white border-b-0'
            : 'bg-white/80 backdrop-blur-md border-b border-gray-200 text-gray-900 shadow-sm'
            }`}>
            <div className="w-10 flex justify-start">
                {showBack && (
                    <button
                        onClick={handleBack}
                        className={`p-2 -ml-2 rounded-full transition-colors ${isGhost
                                ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                                : 'hover:bg-gray-100/80 active:bg-gray-200/80 text-gray-900'
                            }`}
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
            </div>

            <div className="flex-1 flex justify-center px-2">
                <h1 className={`font-bold text-lg text-center truncate ${isGhost ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                </h1>
            </div>

            <div className="w-10 flex justify-end">
                {rightAction}
            </div>
        </div>
    );
}
