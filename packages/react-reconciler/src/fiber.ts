import { Key, Props, Ref } from "shared/ReactTypes";
import { WorkTag } from "./workTag";
import { Flags, NoFlags } from "./fiberFlags";
import { Container } from "hostConfig";

export class FiberNode {
  tag: WorkTag;
  key: Key;
  stateNode: any;
  type: any;
  pendingProps: Props | null;
  return: FiberNode | null;
  sibling: FiberNode | null;
  child: FiberNode | null;
  index: number;
  ref: Ref;
  memoizedProps: Props | null;
  alternate: FiberNode | null;
  flags: Flags;
  updateQueue: unknown;
  memoizedState: null;

  constructor(tag: WorkTag, pendingProps: Props, key: Key) {
    this.tag = tag;
    this.key = key;
    // HostComponent <div>真实DOM
    this.stateNode = null;

    // FunctionComponent 组件对应函数
    this.type = null;

    //构成树状结构
    this.return = null;
    this.sibling = null;
    this.child = null;
    this.index = 0;

    this.ref = null;

    // 作为工作单元
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.memoizedState = null;
    this.updateQueue = null;

    this.alternate = null;
    this.flags = NoFlags;
  }
}
/**
 * FiberRootNode 则是整个应用程序的根节点，它包含了整个应用程序的状态和配置信息。
 */
export class FiberRootNode {
  container: Container;
  current: FiberNode;
  finishedWork: FiberNode | null;
  constructor(container: Container, hostRootFiber: FiberNode) {
    // 对应不同环境的容器 比如react-dom就是DOM挂载元素
    this.container = container;
    // 当前的 Fiber 树的根节点。
    this.current = hostRootFiber;
    hostRootFiber.stateNode = this;
    // 已经完成的工作单元的根节点,最终的 Fiber 树的根节点，以便进行一些收尾工作，比如清理副作用等。
    this.finishedWork = null;
  }
}

// 创建wip,复用部分属性
export const createWorkInProgress = (
  current: FiberNode,
  pendingProps: Props
): FiberNode => {
  let wip = current.alternate;
  if (wip === null) {
    // mount
    wip = new FiberNode(current.tag, pendingProps, current.key);
    wip.stateNode = current.stateNode;
    wip.alternate = current;
    current.alternate = wip;
  } else {
    // update
    wip.pendingProps = pendingProps;
    wip.flags = NoFlags;
  }
  wip.type = current.type;
  wip.updateQueue = current.updateQueue;
  wip.child = current.child;
  wip.memoizedProps = current.memoizedProps;
  wip.memoizedState = current.memoizedState;
  return wip;
};
