import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ImageManager } from './components/ImageManager';
import { Theme, ViewMode } from './types';
import { INITIAL_MARKDOWN } from './constants';
import { cn } from './utils/classNames';

const App: React.FC = () => {
    // State
    const [markdown, setMarkdown] = useState<string>(() => {
        const saved = localStorage.getItem('markdown-content');
        return saved !== null ? saved : INITIAL_MARKDOWN;
    });

    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') {
            return Theme.LIGHT;
        }
        const storedTheme = localStorage.getItem('markview-theme') as Theme | null;
        if (storedTheme === Theme.DARK || storedTheme === Theme.LIGHT) {
            return storedTheme;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return Theme.DARK;
        }
        return Theme.LIGHT;
    });

    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
    const previewRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLTextAreaElement>(null);
    // Print margins in millimeters (visual margins inside printable area)
    const [printMarginX, setPrintMarginX] = useState<number>(() => {
        if (typeof window === 'undefined') return 0;
        const stored = localStorage.getItem('markview-print-margin-x');
        const value = stored !== null ? Number(stored) : NaN;
        return Number.isFinite(value) ? value : 0;
    }); // left/right
    const [printMarginY, setPrintMarginY] = useState<number>(() => {
        if (typeof window === 'undefined') return 0;
        const stored = localStorage.getItem('markview-print-margin-y');
        const value = stored !== null ? Number(stored) : NaN;
        return Number.isFinite(value) ? value : 0;
    }); // top/bottom

    // 图片管理（使用 base64 持久化到 localStorage）
    const [images, setImages] = useState<{ id: string; name: string; url: string; base64?: string; }[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('markview-images');
            if (saved) {
                const parsed = JSON.parse(saved);
                // 将 base64 转换为可用的 data URL
                return parsed.map((img: { id: string; name: string; base64: string }) => ({
                    id: img.id,
                    name: img.name,
                    url: img.base64.startsWith('data:') ? img.base64 : `data:image/${img.name.split('.').pop() || 'png'};base64,${img.base64}`,
                    base64: img.base64,
                }));
            }
        } catch (err) {
            console.error('Failed to load images from localStorage', err);
        }
        return [];
    });
    const [showImageManager, setShowImageManager] = useState(false);

    // Derived state for reading stats
    const [stats, setStats] = useState({ words: 0, chars: 0, readTime: 0 });

    // Effects
    useEffect(() => {
        localStorage.setItem('markdown-content', markdown);

        // Calculate stats
        const text = markdown.replace(/[#*`~>\[\]()-]/g, '').trim();
        const words = text ? text.split(/\s+/).length : 0;
        const chars = text.length;
        const readTime = Math.ceil(words / 200); // Avg 200 wpm
        setStats({ words, chars, readTime });
    }, [markdown]);

    // Persist print margins
    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('markview-print-margin-x', String(printMarginX));
        localStorage.setItem('markview-print-margin-y', String(printMarginY));
    }, [printMarginX, printMarginY]);

    // 持久化图片到 localStorage
    useEffect(() => {
        if (typeof window === 'undefined' || images.length === 0) return;
        try {
            const toSave = images.map(img => ({
                id: img.id,
                name: img.name,
                base64: img.base64 || img.url,
            }));
            localStorage.setItem('markview-images', JSON.stringify(toSave));
        } catch (err) {
            console.error('Failed to save images to localStorage', err);
        }
    }, [images]);

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        const isDark = theme === Theme.DARK;

        root.classList.toggle('dark', isDark);
        root.dataset.theme = theme;
        root.style.colorScheme = isDark ? 'dark' : 'light';

        if (body) {
            body.classList.toggle('dark', isDark);
        }

        localStorage.setItem('markview-theme', theme);
    }, [theme]);

    // Handlers
    const toggleTheme = () => {
        setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(markdown);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    // 将文件转换为 base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // 如果已经是 data URL，直接返回；否则提取 base64 部分
                if (result.startsWith('data:')) {
                    resolve(result);
                } else {
                    resolve(result);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleAddImages = async (files: FileList) => {
        const newImages: { id: string; name: string; url: string; base64: string; }[] = [];

        for (const file of Array.from(files)) {
            try {
                const base64 = await fileToBase64(file);
                const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`;
                newImages.push({
                    id,
                    name: file.name,
                    url: base64, // 使用 base64 data URL
                    base64, // 保存原始 base64 用于持久化
                });
            } catch (err) {
                console.error(`Failed to convert ${file.name} to base64:`, err);
            }
        }

        if (newImages.length > 0) {
            setImages(prev => {
                const updated = [...prev, ...newImages];
                // 保存到 localStorage（只保存 base64 数据）
                try {
                    const toSave = updated.map(img => ({
                        id: img.id,
                        name: img.name,
                        base64: img.base64 || img.url,
                    }));
                    localStorage.setItem('markview-images', JSON.stringify(toSave));
                } catch (err) {
                    console.error('Failed to save images to localStorage', err);
                }
                return updated;
            });
        }
    };

    const handleInsertImageMarkdown = (image: { id: string; name: string; url: string }) => {
        const textarea = editorRef.current;
        const current = markdown;
        const safeName = image.name.replace(/\.[^/.]+$/, '');
        const alt = safeName || 'image';
        // 使用短引用格式 @image-id 而不是完整的 base64 URL
        // 确保图片 ID 被正确转义（虽然通常不需要，但为了安全）
        const snippet = `![${alt}](@${image.id})`;

        // 调试：确认图片存在
        const imageExists = images.some(img => img.id === image.id);
        if (!imageExists) {
            console.warn('Warning: Image not found in images array:', image.id);
        }

        // 如果拿不到编辑器 ref，就退化为追加到末尾
        if (!textarea) {
            const md = `\n\n${snippet}\n`;
            setMarkdown(prev => prev + md);
            return;
        }

        const start = textarea.selectionStart ?? current.length;
        const end = textarea.selectionEnd ?? current.length;

        const before = current.slice(0, start);
        const after = current.slice(end);

        const needsLeadingNewline = before !== '' && !before.endsWith('\n');
        const needsTrailingNewline = after !== '' && !after.startsWith('\n');

        const leading = needsLeadingNewline ? '\n' : '';
        const trailing = needsTrailingNewline ? '\n' : '';

        const nextValue = `${before}${leading}${snippet}${trailing}${after}`;

        setMarkdown(nextValue);

        // 恢复光标到插入的图片 markdown 之后并聚焦编辑器
        const cursorPos = (before + leading + snippet).length;
        requestAnimationFrame(() => {
            if (editorRef.current) {
                editorRef.current.focus();
                editorRef.current.selectionStart = cursorPos;
                editorRef.current.selectionEnd = cursorPos;
            }
        });
    };

    const handleExportMd = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportPdf = useCallback(() => {
        const previewPane = previewRef.current;
        if (!previewPane) {
            alert('Nothing to export yet.');
            return;
        }

        const clonedPreview = previewPane.cloneNode(true) as HTMLDivElement;
        clonedPreview.id = 'app-preview-pane-print';

        // 确保克隆的预览面板中的图片能正确显示
        // 由于 Preview 组件已经处理了图片引用，克隆的 DOM 应该已经包含正确的图片
        // 但我们需要确保图片的 src 属性在打印时仍然有效
        const images = clonedPreview.querySelectorAll('img');
        images.forEach(img => {
            // 确保图片在打印时可见
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            // 如果图片 src 是 base64，确保它被正确保留
            if (img.src && img.src.startsWith('data:')) {
                // base64 图片应该已经正确设置，无需额外处理
            }
        });

        const printContainerId = 'app-print-container';
        let printContainer = document.getElementById(printContainerId) as HTMLDivElement | null;

        if (!printContainer) {
            printContainer = document.createElement('div');
            printContainer.id = printContainerId;
            document.body.appendChild(printContainer);
        }

        printContainer.innerHTML = '';
        printContainer.appendChild(clonedPreview);

        // Pass user-selected print margins to CSS via custom properties (in mm)
        document.body.style.setProperty('--print-margin-x', `${printMarginX}mm`);
        document.body.style.setProperty('--print-margin-y', `${printMarginY}mm`);
        document.body.classList.add('print-active');

        const handleAfterPrint = () => {
            document.body.classList.remove('print-active');
            printContainer?.remove();
            // Clean up custom properties
            document.body.style.removeProperty('--print-margin-x');
            document.body.style.removeProperty('--print-margin-y');
            window.removeEventListener('afterprint', handleAfterPrint);
        };

        window.addEventListener('afterprint', handleAfterPrint);

        // Allow the DOM to update before triggering print
        requestAnimationFrame(() => {
            window.print();
        });
    }, [printMarginX, printMarginY]);

    const handleClear = () => {
        if (confirm('Are you sure you want to clear all content?')) {
            setMarkdown('');
        }
    };

    // Layout Logic
    const showEditor = viewMode === ViewMode.SPLIT || viewMode === ViewMode.EDITOR;
    const showPreview = viewMode === ViewMode.SPLIT || viewMode === ViewMode.PREVIEW;
    const isDark = theme === Theme.DARK;

    const shellClasses = cn(
        'h-screen flex flex-col overflow-hidden transition-colors duration-200',
        isDark ? 'bg-gray-900' : 'bg-white'
    );

    const editorPaneClasses = cn(
        viewMode === ViewMode.SPLIT ? 'w-1/2' : 'w-full',
        viewMode === ViewMode.SPLIT && 'border-r',
        viewMode === ViewMode.SPLIT && (isDark ? 'border-gray-700' : 'border-gray-200'),
        'h-full transition-all duration-300'
    );

    const previewPaneClasses = cn(
        viewMode === ViewMode.SPLIT ? 'w-1/2' : 'w-full',
        'h-full transition-all duration-300',
        isDark ? 'bg-[#0d1117]' : 'bg-gray-50'
    );

    const footerClasses = cn(
        'h-8 border-t flex items-center justify-between px-4 text-xs select-none z-10',
        isDark ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-500'
    );

    return (
        <div className={shellClasses}>
            <Toolbar
                theme={theme}
                toggleTheme={toggleTheme}
                viewMode={viewMode}
                setViewMode={setViewMode}
                printMarginX={printMarginX}
                printMarginY={printMarginY}
                setPrintMarginX={setPrintMarginX}
                setPrintMarginY={setPrintMarginY}
                onCopy={handleCopy}
                onExportMd={handleExportMd}
                onExportPdf={handleExportPdf}
                onClear={handleClear}
                onToggleImageManager={() => setShowImageManager(prev => !prev)}
            />

            <main className="flex-1 flex overflow-hidden relative">
                {showEditor && (
                    <div className={editorPaneClasses}>
                        <Editor ref={editorRef} value={markdown} onChange={setMarkdown} theme={theme} />
                    </div>
                )}

                {showPreview && (
                    <div className={previewPaneClasses}>
                        <Preview ref={previewRef} markdown={markdown} theme={theme} images={images} />
                    </div>
                )}
            </main>

            {/* Bottom Status Bar */}
            <div className={footerClasses} id="app-footer">
                <div className="flex gap-4">
                    <span>{stats.words} Words</span>
                    <span>{stats.chars} Characters</span>
                </div>
                <div className="flex gap-4">
                    <span>{stats.readTime} min read</span>
                    <span>Markdown</span>
                    <span className="hidden sm:inline">UTF-8</span>
                </div>
            </div>

            <ImageManager
                theme={theme}
                isOpen={showImageManager}
                images={images}
                onClose={() => setShowImageManager(false)}
                onAddImages={handleAddImages}
                onInsertImageMarkdown={handleInsertImageMarkdown}
                onDeleteImage={(imageId) => {
                    setImages(prev => {
                        const updated = prev.filter(img => img.id !== imageId);
                        // 更新 localStorage
                        try {
                            if (updated.length === 0) {
                                localStorage.removeItem('markview-images');
                            } else {
                                const toSave = updated.map(img => ({
                                    id: img.id,
                                    name: img.name,
                                    base64: img.base64 || img.url,
                                }));
                                localStorage.setItem('markview-images', JSON.stringify(toSave));
                            }
                        } catch (err) {
                            console.error('Failed to update images in localStorage', err);
                        }
                        return updated;
                    });
                }}
            />
        </div>
    );
};

export default App;
