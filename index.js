const data = require('./input/nodes.json')
var fs = require("fs");

function compareByPrevSibling(a, b) {
  if (a.previousSiblingId === null) return -1
  if (a.nodeId === b.previousSiblingId) return -1
  return 0
}

/**
 * Recursive function that returns the subtree of a root node (item) using the array (arr)
 * This function can be used as a solution for creating trees with multi-root nodes as well as for single root nodes
 * @param {Array} arr 
 * @param {Object} item 
 * @returns {Object} root node
 */
function buildTree(arr, item) {

  // if the root node is not passed as argument when the function is passed the first time, it means the array will generate a single root tree
  if (!item) {
    item = arr.find((item) => item.parent === null);
  }
  
  let node = { ...item };
  // this section finds every element with the parentId equal to the current nodeId 
  node.children = arr.filter((x) => x.parentId === item.nodeId)
                  .map((y) => buildTree(arr, y)) // recursive call to the function to build the sub-tree for every child of the current node
                  .sort(compareByPrevSibling)
  
  return node;
}

let tree = [];
let rootNodes = data.filter((node) => node.parentId === null)
                    .sort(compareByPrevSibling)

rootNodes.forEach((item) => {
  tree.push(buildTree(data, item));
});

/* creates a solution.json file which containes the resulting tree */
fs.writeFile("solution.json", JSON.stringify(tree), function (err, result) {
  if (err) console.log("error", err);
});