import DragStatusEnum from "../enum/dragStatus";

export type DragState = {
  status: DragStatusEnum;
  type: string | null;
  cardId: number | null;
  itemId: number | null;
};
