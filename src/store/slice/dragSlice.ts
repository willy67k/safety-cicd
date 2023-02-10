import { createSlice } from "@reduxjs/toolkit";
import DragStatusEnum from "../../enum/dragStatus";
import { DragState } from "../../type/store";

const initialState: DragState = {
  status: DragStatusEnum.normal,
  type: null,
  cardId: null,
  itemId: null,
};

export const dragSlice = createSlice({
  name: "drag",
  initialState,
  reducers: {
    setStatus: (state, { payload }) => {
      state.status = payload;
    },
    setType: (state, { payload }) => {
      state.type = payload;
    },
    setTargetItem: (state, { payload }) => {
      state.cardId = payload.id_group;
      state.itemId = payload.id;
    },
  },
});

export const { setStatus, setType, setTargetItem } = dragSlice.actions;

export default dragSlice.reducer;
