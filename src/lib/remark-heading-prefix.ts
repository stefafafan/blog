import type { Heading, Root } from 'mdast'
import { visit } from 'unist-util-visit'

export default function remarkHeadingPrefix() {
  return (tree: Root) => {
    visit(tree, 'heading', (node: Heading) => {
      if (!node.children) return

      // Generate the prefix based on the heading depth
      const prefix = '#'.repeat(node.depth) + ' '

      if (prefix) {
        node.children.unshift({
          type: 'text',
          value: prefix,
        })
      }
    })
  }
}
