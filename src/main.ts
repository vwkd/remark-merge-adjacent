import { visit } from "../deps.ts";
import type { Plugin, Root } from "../deps.ts";

const NODES = ["emphasis", "link", "strong"];

/**
 * Merges children of identical sibling node with same properties
 * with children of node and removes sibling node from tree
 *
 * Return previous index to traverse node again in case there are
 * more sibling nodes to merge with
 *
 * Note: doesn't need to also check `siblingBefore`
 * since always NLR traversal (by default)
 */
const remarkMergeAdjacent: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, NODES, (node, index, parent) => {
      const siblingAfter = parent.children[index + 1];

      if (siblingAfter?.type == node.type) {
        if (
          node.type == "link" &&
          (node.url !== siblingAfter.url || node.title !== siblingAfter.title)
        ) {
          return;
        }

        node.children = [...node.children, ...siblingAfter.children];

        parent.children.splice(index + 1, 1);

        return index;
      }
    });
  };
};

export default remarkMergeAdjacent;
