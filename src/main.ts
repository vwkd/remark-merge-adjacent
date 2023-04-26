import { visit } from "../deps.ts";
import type { Plugin, Root } from "../deps.ts";

const NODES = ["emphasis", "link", "strong"];

/**
 * Merges children of identical sibling node with same properties
 * with children of node and removes sibling node from tree
 */
const remarkMergeAdjacent: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, NODES, (node, index, parent) => {
      const siblingAfter = parent.children[index + 1];
      const siblingBefore = parent.children[index - 1];

      if (siblingAfter?.type == node.type) {
        if (
          node.type == "link" &&
          (node.url !== siblingAfter.url || node.title !== siblingAfter.title)
        ) {
          return;
        }

        node.children = [...node.children, ...siblingAfter.children];

        parent.children.splice(index + 1, 1);
      } else if (siblingBefore?.type == node.type) {
        if (
          node.type == "link" &&
          (node.url !== siblingBefore.url || node.title !== siblingBefore.title)
        ) {
          return;
        }

        node.children = [...siblingBefore.children, ...node.children];

        parent.children.splice(index - 1, 1);
      }
    });
  };
};

export default remarkMergeAdjacent;
