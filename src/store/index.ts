import { configureStore } from "@reduxjs/toolkit";
import { DragState } from "../type/store";
import dragReducer from "./slice/dragSlice";

export const store = configureStore({
  reducer: {
    drag: dragReducer,
  },
});

export interface RootState {
  drag: DragState;
}
