import { Action } from "shared/ReactTypes";

export interface Update<State> {
  action: Action<State>;
}

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null;
  };
}

// 创建Update对象
export const createUpdate = <State>(action: Action<State>): Update<State> => {
  return {
    action,
  };
};

// 创建Update对象,为了提高性能和减少内存占用，React 使用了共享模式来实现多个组件共享同一个 UpdateQueue 实例。
export const createUpdateQueue = <Action>() => {
  return {
    shared: {
      pending: null,
    },
  } as UpdateQueue<Action>;
};

// 添加队列
export const enqueueUpdate = <Action>(
  updateQueue: UpdateQueue<Action>,
  update: Update<Action>
) => {
  updateQueue.shared.pending = update;
};

export const processUpdateQueue = <State>(
  baseState: State,
  pendingUpdate: Update<State> | null
): { memoizedState: State } => {
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState,
  };
  if (pendingUpdate !== null) {
    const action = pendingUpdate.action;
    if (action instanceof Function) {
      result.memoizedState = action(baseState);
    } else {
      result.memoizedState = action;
    }
  }
  return result;
};
