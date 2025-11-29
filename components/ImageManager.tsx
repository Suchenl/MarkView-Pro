import React, { useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Theme } from '../types';
import { cn } from '../utils/classNames';

interface ImageItem {
    id: string;
    name: string;
    url: string;
}

interface ImageManagerProps {
    theme: Theme;
    isOpen: boolean;
    images: ImageItem[];
    onClose: () => void;
    onAddImages: (files: FileList) => void;
    onInsertImageMarkdown: (image: ImageItem) => void;
    onDeleteImage: (imageId: string) => void;
}

export const ImageManager: React.FC<ImageManagerProps> = ({
    theme,
    isOpen,
    images,
    onClose,
    onAddImages,
    onInsertImageMarkdown,
    onDeleteImage,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const isDark = theme === Theme.DARK;

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onAddImages(e.target.files);
            // 允许重复选择同一文件
            e.target.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            // 过滤出图片文件
            const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            if (imageFiles.length > 0) {
                // 创建一个 FileList 对象
                const dataTransfer = new DataTransfer();
                imageFiles.forEach(file => dataTransfer.items.add(file));
                onAddImages(dataTransfer.files);
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={cn(
                    'relative z-50 w-full max-w-3xl mx-4 rounded-2xl shadow-2xl border flex flex-col max-h-[80vh]',
                    isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
                    isDragging && 'ring-2 ring-blue-500 ring-offset-2'
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div
                    className={cn(
                        'flex items-center justify-between px-4 py-3 border-b',
                        isDark ? 'border-gray-800' : 'border-gray-100'
                    )}
                >
                    <div>
                        <h2 className="text-sm font-semibold">图片管理</h2>
                        <p className="text-xs text-gray-500">
                            图片保存在浏览器本地存储中，刷新后不会丢失。
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className={cn(
                            'px-2 py-1 rounded-md text-xs',
                            isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                        )}
                    >
                        关闭
                    </button>
                </div>

                <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-dashed border-gray-300 dark:border-gray-700">
                    <div className="text-xs text-gray-500">
                        支持拖拽 / 选择多张图片，上传后可一键插入 Markdown。
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-xs font-medium',
                                isDark
                                    ? 'bg-blue-900/40 text-blue-200 hover:bg-blue-900/60'
                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            )}
                        >
                            选择图片
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-xs">
                    {images.length === 0 ? (
                        <div
                            className={cn(
                                'border border-dashed rounded-xl px-4 py-8 text-center',
                                isDark ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-500',
                                isDragging && (isDark ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50')
                            )}
                        >
                            {isDragging ? (
                                <div className="text-blue-500 font-medium">松开鼠标以添加图片</div>
                            ) : (
                                <div>暂无图片，请点击右上角「选择图片」或拖拽图片到此处进行添加。</div>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {images.map((img) => (
                                <div
                                    key={img.id}
                                    className={cn(
                                        'border rounded-xl overflow-hidden flex flex-col group relative',
                                        isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
                                    )}
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={img.url}
                                            alt={img.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(`确定要删除图片 "${img.name}" 吗？`)) {
                                                    onDeleteImage(img.id);
                                                }
                                            }}
                                            className={cn(
                                                'absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity',
                                                isDark
                                                    ? 'bg-red-900/80 text-red-200 hover:bg-red-900'
                                                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                                            )}
                                            title="删除图片"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="px-2 py-2 flex flex-col gap-1">
                                        <div
                                            className="truncate text-[11px]"
                                            title={img.name}
                                        >
                                            {img.name}
                                        </div>
                                        <button
                                            onClick={() => onInsertImageMarkdown(img)}
                                            className={cn(
                                                'mt-1 w-full px-2 py-1 rounded-md text-[11px] font-medium',
                                                isDark
                                                    ? 'bg-blue-900/40 text-blue-200 hover:bg-blue-900/70'
                                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                            )}
                                        >
                                            插入到 Markdown
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div
                    className={cn(
                        'px-4 py-2 border-t text-[11px] text-gray-500',
                        isDark ? 'border-gray-800' : 'border-gray-100'
                    )}
                >
                    说明：图片保存在浏览器本地存储中，刷新后不会丢失。图片不会上传到服务器。
                </div>
            </div>
        </div>
    );
};


