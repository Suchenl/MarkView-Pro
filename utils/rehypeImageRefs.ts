import { visit } from 'unist-util-visit';
import type { Element } from 'hast';

interface ImageRefsOptions {
    imageMap: Map<string, string>;
}

/**
 * Rehype plugin to ensure image URLs are correctly set in the HTML AST
 * This runs after remark plugins, in the HTML transformation phase
 */
export function rehypeImageRefs(options: ImageRefsOptions) {
    const { imageMap } = options;

    return (tree: any) => {
        visit(tree, 'element', (node: Element) => {
            if (node.tagName === 'img' && node.properties) {
                const src = node.properties.src as string;
                
                // If src is empty or starts with @, try to fix it
                if (!src || src.startsWith('@')) {
                    if (src && src.startsWith('@')) {
                        const imageId = src.slice(1);
                        const imageUrl = imageMap.get(imageId);
                        if (imageUrl) {
                            node.properties.src = imageUrl;
                        }
                    }
                }
            }
        });
    };
}

