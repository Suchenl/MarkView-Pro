import React from 'react';
import {
    Moon, Sun, Download, Copy, FileCode, FileText,
    Columns, Eye, Edit3, Trash2, Image
} from 'lucide-react';
import { Theme, ViewMode } from '../types';
import { cn } from '../utils/classNames';

interface ToolbarProps {
    theme: Theme;
    toggleTheme: () => void;
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    printMarginX: number;
    printMarginY: number;
    setPrintMarginX: (value: number) => void;
    setPrintMarginY: (value: number) => void;
    onExportPdf: () => void;
    onExportMd: () => void;
    onCopy: () => void;
    onClear: () => void;
    onToggleImageManager: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    theme,
    toggleTheme,
    viewMode,
    setViewMode,
    printMarginX,
    printMarginY,
    setPrintMarginX,
    setPrintMarginY,
    onExportPdf,
    onExportMd,
    onCopy,
    onClear,
    onToggleImageManager
}) => {
    const isDark = theme === Theme.DARK;

    const viewButtonClasses = (targetMode: ViewMode) => cn(
        'p-1.5 rounded-md transition-all',
        viewMode === targetMode
            ? cn('shadow-sm', isDark ? 'bg-gray-600 text-blue-400' : 'bg-white text-blue-600')
            : isDark
                ? 'text-gray-300 hover:text-gray-100'
                : 'text-gray-500 hover:text-gray-700'
    );

    const actionButtonClasses = cn(
        'p-2 rounded-lg transition-colors',
        isDark ? 'text-gray-400 hover:text-gray-100 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
    );

    return (
        <div
            className={cn(
                'h-16 border-b flex items-center justify-between px-4 sticky top-0 z-20 shadow-sm transition-colors duration-200',
                isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            )}
            id="app-toolbar"
        >
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        'p-1.5 rounded-lg',
                        isDark ? 'bg-white text-black' : 'bg-black text-white'
                    )}
                >
                    <FileCode size={20} className="stroke-[2.5]" />
                </div>
                <h1 className="font-bold text-lg tracking-tight hidden sm:block">
                    MarkView <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Pro</span>
                </h1>
            </div>

            <div className="flex items-center gap-2">
                {/* View Modes */}
                <div
                    className={cn(
                        'hidden md:flex rounded-lg p-1 mr-2',
                        isDark ? 'bg-gray-700' : 'bg-gray-100'
                    )}
                >
                    <button
                        onClick={() => setViewMode(ViewMode.EDITOR)}
                        className={viewButtonClasses(ViewMode.EDITOR)}
                        title="Editor Only"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode(ViewMode.SPLIT)}
                        className={viewButtonClasses(ViewMode.SPLIT)}
                        title="Split View"
                    >
                        <Columns size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode(ViewMode.PREVIEW)}
                        className={viewButtonClasses(ViewMode.PREVIEW)}
                        title="Preview Only"
                    >
                        <Eye size={16} />
                    </button>
                </div>

                {/* Print margin numeric controls */}
                <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mr-2">
                    <span>打印边距</span>
                    <label className="flex items-center gap-1">
                        <span>左右</span>
                        <input
                            type="number"
                            min={0}
                            max={40}
                            step={1}
                            className={cn(
                                'w-14 rounded-md border px-1 py-0.5 bg-transparent text-right',
                                isDark ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-700'
                            )}
                            value={printMarginX}
                            onChange={e => setPrintMarginX(Number(e.target.value) || 0)}
                        />
                    </label>
                    <label className="flex items-center gap-1">
                        <span>上下</span>
                        <input
                            type="number"
                            min={0}
                            max={40}
                            step={1}
                            className={cn(
                                'w-14 rounded-md border px-1 py-0.5 bg-transparent text-right',
                                isDark ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-700'
                            )}
                            value={printMarginY}
                            onChange={e => setPrintMarginY(Number(e.target.value) || 0)}
                        />
                    </label>
                    <span> mm</span>
                </div>

                <div className={cn('w-px h-6 mx-1', isDark ? 'bg-gray-700' : 'bg-gray-200')}></div>

                {/* Actions */}
                <button
                    onClick={onToggleImageManager}
                    className={actionButtonClasses}
                    title="Image Manager"
                >
                    <Image size={18} />
                </button>
                <div className={cn('w-px h-6 mx-1', isDark ? 'bg-gray-700' : 'bg-gray-200')}></div>
                <button onClick={onCopy} className={actionButtonClasses} title="Copy Markdown">
                    <Copy size={18} />
                </button>
                <button onClick={onExportMd} className={actionButtonClasses} title="Export MD">
                    <Download size={18} />
                </button>
                <button onClick={onExportPdf} className={actionButtonClasses} title="Export PDF">
                    <FileText size={18} />
                </button>
                <button
                    onClick={onClear}
                    className={cn(
                        'p-2 text-red-500 rounded-lg transition-colors',
                        isDark ? 'hover:text-red-300 hover:bg-red-900/20' : 'hover:text-red-700 hover:bg-red-50'
                    )}
                    title="Clear All"
                >
                    <Trash2 size={18} />
                </button>

                <div className={cn('w-px h-6 mx-1', isDark ? 'bg-gray-700' : 'bg-gray-200')}></div>

                <button
                    onClick={toggleTheme}
                    className={cn(
                        'p-2 rounded-lg transition-colors',
                        isDark ? 'text-blue-400 hover:bg-blue-900/20' : 'text-yellow-500 hover:bg-yellow-50'
                    )}
                >
                    {theme === Theme.LIGHT ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </div>
    );
};
