import React, { forwardRef } from 'react';
import { Theme } from '../types';
import { cn } from '../utils/classNames';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
    theme: Theme;
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(
    ({ value, onChange, theme }, ref) => {
        const isDark = theme === Theme.DARK;

        return (
            <div
                className={cn(
                    'h-full w-full flex flex-col relative',
                    isDark ? 'bg-gray-900' : 'bg-white'
                )}
                id="app-editor-pane"
            >
                <div
                    className={cn(
                        'absolute top-0 left-0 right-0 h-1 bg-gradient-to-b to-transparent pointer-events-none z-10',
                        isDark ? 'from-black/20' : 'from-gray-100/50'
                    )}
                ></div>
                <textarea
                    ref={ref}
                    className={cn(
                        'flex-1 w-full h-full p-6 resize-none outline-none border-none bg-transparent font-mono text-sm sm:text-base leading-relaxed',
                        isDark ? 'text-gray-200 placeholder-gray-600' : 'text-gray-800 placeholder-gray-400'
                    )}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Start typing markdown here..."
                    spellCheck={false}
                />
            </div>
        );
    }
);

Editor.displayName = 'Editor';
