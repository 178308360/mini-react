export type WorkTag =
  | typeof FunctionComponent
  | typeof HostRoot
  | typeof HostComponent
  | typeof HostText;

export const FunctionComponent = 0;

// 挂载的根节点对应的根节点类型
export const HostRoot = 3;

//<div>
export const HostComponent = 5;

// <div>123</div>中的123
export const HostText = 6;
