export type Flags =
  | typeof NoFlags
  | typeof Placement
  | typeof Update
  | typeof ChildDeletion;
export const NoFlags = 0b1;

export const Placement = 0b10;

export const Update = 0b100;

export const ChildDeletion = 0b1000;
