import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { FiberNode, FiberRootNode, createWorkInProgress } from "./fiber";
import { HostRoot } from "./workTag";

let workInProgress: FiberNode | null = null;

// 用于准备一个新的 Fiber 树
function prepareFreshStack(root: FiberRootNode) {
  // 通过HostRootFiber创建一个对应workInProgress
  workInProgress = createWorkInProgress(root.current, {});
}


export function scheduleUpdateOnFiber(fiber: FiberNode) {
  // 向上寻找,获取FiberRootNode
  const root = markUpdateFromFiberToRoot(fiber);
  renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode;
  }
}

function renderRoot(root: FiberRootNode) {
  prepareFreshStack(root);
  do {
    try {
      workLoop();
      break;
    } catch (error) {
      workInProgress = null;
    }
    // eslint-disable-next-line no-constant-condition
  } while (true);
}

/**
 * 用于循环执行工作单元（unit of work）直到所有工作单元都被处理完毕。
 * 循环递归从根节点开始深度遍历,递阶段有子节点遍历子节点,没有则找兄弟节点,都无,开始归阶段
 */
function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

//用于执行当前工作单元（unit of work）并返回下一个工作单元。
function performUnitOfWork(fiber: FiberNode) {
  const next: FiberNode | null = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;
  // 没有子节点
  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

//用于完成当前工作单元（unit of work）并返回下一个工作单元。
function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;
  do {
    completeWork(node);
    const sibling = node.sibling;
    if (sibling !== null) {
      workInProgress = sibling;
      return;
    }
    node = node.return;
    workInProgress = node;
  } while (node !== null);
}
