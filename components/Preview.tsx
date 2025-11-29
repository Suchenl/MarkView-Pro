import React, { forwardRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Theme } from '../types';
import { cn } from '../utils/classNames';
import { remarkImageRefs } from '../utils/remarkImageRefs';
import { rehypeImageRefs } from '../utils/rehypeImageRefs';

interface ImageItem {
    id: string;
    name: string;
    url: string;
}

interface PreviewProps {
    markdown: string;
    theme: Theme;
    images?: ImageItem[];
}

export const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ markdown, theme, images = [] }, ref) => {
    const isDark = theme === Theme.DARK;

    // 创建图片 ID 到 URL 的映射（用于 remark 插件）
    const imageMap = useMemo(() => {
        const map = new Map<string, string>();
        images.forEach(img => {
            map.set(img.id, img.url);
        });
        return map;
    }, [images]);
    const containerClasses = cn(
        'h-full w-full overflow-y-auto p-8 md:p-12 transition-colors duration-200',
        isDark ? 'bg-[#0d1117]' : 'bg-gray-50'
    );
    const articleClasses = cn(
        'prose prose-slate max-w-none prose-headings:font-semibold prose-h1:text-3xl prose-h1:tracking-tight prose-pre:bg-transparent prose-pre:p-0 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-img:rounded-xl prose-img:shadow-md transition-colors duration-200',
        isDark ? 'prose-invert' : '',
        isDark ? 'prose-a:text-blue-400' : 'prose-a:text-blue-600',
        isDark ? 'prose-blockquote:bg-blue-900/20' : 'prose-blockquote:bg-blue-50'
    );

    return (
        <div
            ref={ref}
            className={containerClasses}
            id="app-preview-pane"
        >
            <article className={articleClasses}>
                <ReactMarkdown
                    remarkPlugins={[
                        [remarkImageRefs, { imageMap }], // 先处理图片引用
                        remarkGfm,
                        remarkMath,
                    ]}
                    rehypePlugins={[
                        [rehypeImageRefs, { imageMap }], // 在 HTML 转换阶段确保图片 URL 正确
                        rehypeKatex
                    ]}
                    components={{
                        code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <div
                                    className={cn(
                                        'relative group rounded-lg overflow-hidden my-6 shadow-sm border',
                                        isDark ? 'border-gray-700' : 'border-gray-200'
                                    )}
                                >
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{match[1]}</div>
                                    </div>
                                    <SyntaxHighlighter
                                        style={theme === Theme.DARK ? oneDark : oneLight}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{ margin: 0, padding: '1.5rem', background: theme === Theme.DARK ? '#161b22' : '#f8fafc' }}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            ) : (
                                <code
                                    className={cn(
                                        className,
                                        "rounded px-1.5 py-0.5 text-sm font-mono before:content-[''] after:content-['']",
                                        isDark ? 'bg-gray-800 text-pink-400' : 'bg-gray-200 text-pink-600'
                                    )}
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        },
                        table({ children }) {
                            return (
                                <div
                                    className={cn(
                                        'overflow-x-auto my-6 rounded-lg border',
                                        isDark ? 'border-gray-700' : 'border-gray-200'
                                    )}
                                >
                                    <table
                                        className={cn(
                                            'min-w-full divide-y',
                                            isDark ? 'divide-gray-700' : 'divide-gray-200'
                                        )}
                                    >
                                        {children}
                                    </table>
                                </div>
                            )
                        },
                        thead({ children }) {
                            return <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>{children}</thead>
                        },
                        th({ children }) {
                            return (
                                <th
                                    className={cn(
                                        'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
                                        isDark ? 'text-gray-400' : 'text-gray-500'
                                    )}
                                >
                                    {children}
                                </th>
                            )
                        },
                        td({ children }) {
                            return (
                                <td
                                    className={cn(
                                        'px-6 py-4 whitespace-nowrap text-sm',
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    )}
                                >
                                    {children}
                                </td>
                            )
                        },
                        img({ node, src, alt, ...props }: any) {
                            let actualSrc = src;

                            // 如果 src 为空，尝试从 markdown 中查找对应的图片引用
                            if (!actualSrc && alt) {
                                // 在 markdown 中查找匹配的图片引用 ![alt](@image-id)
                                const imageRefRegex = new RegExp(`!\\[${alt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\(@([^)]+)\\)`);
                                const match = markdown.match(imageRefRegex);
                                if (match && match[1]) {
                                    const imageId = match[1];
                                    actualSrc = imageMap.get(imageId) || '';
                                }
                            }

                            // 如果仍然为空，尝试从 node 中获取
                            if (!actualSrc && node) {
                                if (node.properties?.src) {
                                    actualSrc = node.properties.src;
                                } else if (node.url) {
                                    actualSrc = node.url;
                                }
                            }

                            if (!actualSrc) {
                                return null;
                            }

                            return (
                                <img
                                    src={actualSrc}
                                    alt={alt || ''}
                                    className={cn(
                                        'rounded-xl shadow-md max-w-full h-auto',
                                        isDark ? 'opacity-90' : 'opacity-100'
                                    )}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        console.error('Image failed to load:', target.src.substring(0, 50) + '...', alt);
                                    }}
                                    {...props}
                                />
                            );
                        }
                    }}
                >
                    {markdown}
                </ReactMarkdown>
            </article>
        </div>
    );
});

Preview.displayName = 'Preview';
