// B-Tree (minimum degree t = 2 → min keys 1, max keys 3) with step recording
// for animation, plus a simple layout algorithm for SVG rendering.
//nodes get id
//single node can store multiple keys
let idCounter = 0;
const makeNode = (leaf) => ({ id: idCounter++, keys: [], children: [], leaf });
// call with makenode true

//save min degree (t) for B-Tree 3 keys 
export class BTree {
  constructor(t = 2) {
    this.t = t;
    this.root = makeNode(true);
    this.insertions = 0;
    this.deletions = 0;
  }

  snapshot() {
    const clone = (n) =>
      n ? { id: n.id, keys: [...n.keys], leaf: n.leaf, children: n.children.map(clone) } : null;
    return clone(this.root);
  }

  pushStep(steps, type, message, key) {
    steps.push({
      type,
      message,
      key,
      snapshot: this.snapshot(),
      insertions: this.insertions,
      deletions: this.deletions,
    });
  }

  insert(key, steps) {
    const t = this.t;
    let r = this.root;
    if (r.keys.length === 2 * t - 1) {
      const s = makeNode(false);
      s.children.push(r);
      this.splitChild(s, 0);
      this.root = s;
      this.pushStep(steps, "split", `The root is full, so it splits — the middle key rises to become the new root.`, key);
      this.insertNonFull(s, key, steps);
    } else {
      this.insertNonFull(r, key, steps);
    }
    this.insertions += 1;
    this.pushStep(steps, "done", `Inserted ${key}. Tree stays balanced.`, key);
  }

  splitChild(x, i) {
    const t = this.t;
    const y = x.children[i];
    const z = makeNode(y.leaf);
    z.keys = y.keys.splice(t, t - 1);
    const midKey = y.keys.pop();
    if (!y.leaf) z.children = y.children.splice(t, t);
    x.children.splice(i + 1, 0, z);
    x.keys.splice(i, 0, midKey);
  }

  insertNonFull(x, key, steps) {
    const t = this.t;
    let i = x.keys.length - 1;
    if (x.leaf) {
      while (i >= 0 && x.keys[i] > key) i--;
      x.keys.splice(i + 1, 0, key);
      this.pushStep(steps, "insert", `Inserting ${key} into a leaf node.`, key);
    } else {
      while (i >= 0 && x.keys[i] > key) i--;
      i++;
      this.pushStep(steps, "descend", `${key} < root keys? Descending toward the right child.`, key);
      if (x.children[i].keys.length === 2 * t - 1) {
        this.splitChild(x, i);
        this.pushStep(steps, "split", `That child is full — splitting it before descending further.`, key);
        if (key > x.keys[i]) i++;
      }
      this.insertNonFull(x.children[i], key, steps);
    }
  }

  collectKeys(node = this.root, out = []) {
    if (!node) return out;
    if (node.leaf) {
      out.push(...node.keys);
    } else {
      for (let i = 0; i < node.keys.length; i++) {
        this.collectKeys(node.children[i], out);
        out.push(node.keys[i]);
      }
      this.collectKeys(node.children[node.keys.length], out);
    }
    return out;
  }

  // Simplified deletion: pull every remaining key and rebuild via insertion.
  // The end state is a correct, balanced B-Tree; we skip animating the
  // internal borrow/merge steps to keep the module approachable.
  remove(key, steps) {
    const remaining = this.collectKeys().filter((k) => k !== key);
    this.root = makeNode(true);
    const silent = [];
    for (const k of remaining) this.insert(k, silent);
    this.insertions -= remaining.length; // undo the counter bump from the silent rebuild
    this.deletions += 1;
    this.pushStep(steps, "delete", `Removed ${key}. Tree rebalanced automatically.`, key);
  }
}

// ── Layout: assigns x/y to every node for SVG rendering ──
export function layoutTree(root) {
  if (!root) return { positioned: [], edges: [], width: 200, height: 160 };
  const GAP = 22, CELL = 34, PAD = 20, VGAP = 96, TOP = 46;
  let cursorX = 0;
  const positioned = [];
  const edges = [];

  function visit(node, depth) {
    const width = Math.max(56, node.keys.length * CELL + PAD);
    let x;
    const y = depth * VGAP + TOP;
    if (node.leaf || node.children.length === 0) {
      x = cursorX + width / 2;
      cursorX += width + GAP;
    } else {
      node.children.forEach((c) => visit(c, depth + 1));
      const first = positioned.find((p) => p.id === node.children[0].id);
      const last = positioned.find((p) => p.id === node.children[node.children.length - 1].id);
      x = (first.x + last.x) / 2;
    }
    positioned.push({ id: node.id, keys: node.keys, leaf: node.leaf, x, y, w: width });
    node.children.forEach((c) => {
      const cp = positioned.find((p) => p.id === c.id);
      edges.push({ id: `${node.id}-${c.id}`, parentId: node.id, childId: c.id, x1: x, y1: y, x2: cp.x, y2: cp.y });
    });
  }

  visit(root, 0);
  const width = Math.max(cursorX, 160);
  const height = positioned.reduce((m, p) => Math.max(m, p.y), 0) + 70;
  return { positioned, edges, width, height };
}

// ── Guided demo sequence ──
export const SEED_SEQUENCE = [50, 20, 70, 10, 30, 60, 80, 90, 100, 110, 55, 65, 95, 105];

export function buildInitialSteps() {
  const tree = new BTree(2);
  const steps = [];
  // step 0: empty tree, nothing has happened yet
  tree.pushStep(steps, "start", "An empty B-Tree. Insert a key to begin.", null);
  for (const key of SEED_SEQUENCE) tree.insert(key, steps);
  return { tree, steps };
}