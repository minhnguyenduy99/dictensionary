export function createBinaryTreeWord(words) {
  const tree = {
    value: words[0],
    left: null,
    right: null,
  };

  for (let i = 1; i < words.length; i++) {
    insertNode(tree, words[i]);
  }

  return tree;

  function insertNode(node, value) {
    const nodeValue = node.value;
    if (nodeValue === value) {
      return;
    }
    if (value > nodeValue) {
      if (node.right) {
        insertNode(node.right, value);
      } else {
        node.right = {
          value,
          left: null,
          right: null,
        };
      }
      return;
    }

    if (node.left) {
      insertNode(node.left, value);
    }
    node.left = {
      value,
      left: null,
      right: null,
    };
    return;
  }
}

export function searchBinaryTree(wordTree, word) {
  return searchNode(wordTree, word);

  function searchNode(node, word) {
    if (!node) {
      return false;
    }
    if (node.value === word) {
      return true;
    }
    if (word > node.value) {
      return searchNode(node.right, word);
    }
    return searchNode(node.left, word);
  }
}
