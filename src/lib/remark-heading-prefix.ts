import { visit } from 'unist-util-visit';

export default function remarkHeadingPrefix() {
    return (tree) => {
        visit(tree, 'heading', (node) => {
            if (!node.children) return;

            // Generate the prefix based on the heading depth
            const prefix = '#'.repeat(node.depth) + ' ';

            if (prefix) {
                node.children.unshift({
                    type: 'text',
                    value: prefix,
                });
            }
        });
    };
}
