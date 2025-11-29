import { visit } from 'unist-util-visit';
import type { Image } from 'mdast';

interface ImageRefsOptions {
    imageMap: Map<string, string>;
}

/**
 * Remark plugin to transform image references like ![alt](@image-id) 
 * to actual image URLs before ReactMarkdown parses them
 */
export function remarkImageRefs(options: ImageRefsOptions) {
    const { imageMap } = options;

    return (tree: any) => {
        visit(tree, 'image', (node: Image) => {
            // Check if the URL starts with @ (our custom reference format)
            if (node.url && node.url.startsWith('@')) {
                const imageId = node.url.slice(1); // Remove the @ prefix
                const imageUrl = imageMap.get(imageId);
                
                if (imageUrl) {
                    // Replace the reference with the actual URL
                    node.url = imageUrl;
                }
            }
        });
    };
}

