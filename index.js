const data = require("./input/nodes.json");
var fs = require("fs");

function compareByPrevSibling(a, b) {
  if (a.previousSiblingId === null) return -1;
  if (a.nodeId === b.previousSiblingId) return -1;
  return 0;
}

/**
 * Returns tree from flat array
 * @param {Array} arr 
 * @returns {Array} tree
 */
const buildTree = (arr) => {
  const tree = [];
  const items = {};

  // this foreach creates a key value map where the key is the nodeId and the value is the the entire obj
  arr.forEach((node) => (items[node.nodeId] = { ...node, children: [] }));


  // for every element in the flat array the iterated element is pushed into his parents childrens array
  arr.forEach((node) => {
    if (node.parentId != null) {
      items[node.parentId].children.push(items[node.nodeId]);
      items[node.parentId].children.sort(compareByPrevSibling);
    } else {
      tree.push(items[node.nodeId]); // if parentId is null it means it's a root node so it get added to the tree directly
    }
  });
  return tree;
};

/* creates a solution.json file which containes the resulting tree */
fs.writeFile("solution.json", JSON.stringify(buildTree(data).sort(compareByPrevSibling)), function (err, result) {
  if (err) console.log("error", err);
});