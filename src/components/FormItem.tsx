import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ColorEnum from "../enum/color";
import DragStatusEnum from "../enum/dragStatus";
import DragTypeEnum from "../enum/dragType";
import ItemStatusEnum from "../enum/itemStatus";
import { RootState } from "../store";
import { setTargetItem, setStatus as setDragStatus, setType } from "../store/slice/dragSlice";
import DragDots from "./icons/DragDots";

interface FormItemProps {
  id_group: number;
  id: number | string;
  name?: string;
  password?: string;
  statusForce?: ItemStatusEnum;
  setItem?: Function;
  addItem?: Function;
  readyToRemoveItem?: Function;
  setItemSetStatus?: Function;
}

interface FormItemGroupProps {
  id: number;
  name: string;
  setGroup: Function;
  setItemSetStatus?: Function;
  readyToRemoveGroup?: Function;
}

const Order = styled.div<{ status: string; onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void }>`
  position: absolute;
  top: 50%;
  left: -11px;
  width: 13px;
  transition: 0.3s;
  transform: translateY(-50%);
  opacity: 0;
  cursor: ${(props) => props.status !== ItemStatusEnum.add && ItemStatusEnum.grab};
`;

const Item = styled.div<{ status?: string; isFlash?: boolean }>`
  position: relative;
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  transition: ${(props) => (props.isFlash ? 0 : "0.3s")};

  &:last-child {
    border-bottom: none;
  }

  &:hover ${Order} {
    opacity: ${(props) => (props.status === ItemStatusEnum.add ? 0 : 1)};
  }
`;

const ItemGroupName = styled(Item)`
  padding: 0;
  border: none;
`;

const Input = styled.input<{ active: boolean }>`
  margin-right: 16px;
  padding: 4px 8px 2px;
  background-color: transparent;
  border: 1px solid;
  border-color: ${(props) => (props.active ? "rgba(255, 255, 255, 0.1)" : "transparent")};
  border-radius: 4px;
  transition: 0.3s;
`;

const InputGroupName = styled(Input)`
  padding: 2px 8px 4px;
  color: rgba(255, 255, 255, 0.2);
`;

const InputAddress = styled(Input)`
  width: 72px;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
`;

const InputPass = styled(Input)`
  flex-grow: 0;
  flex-shrink: 1;
  width: 100%;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
`;

const Tools = styled.div<{ status: ItemStatusEnum }>`
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  border-left: 1px solid #ffffff;
  transition: 0.3s;

  ${(props) => {
    switch (props.status) {
      case ItemStatusEnum.normal:
        return `
          width: 0px;
          opacity: 0;
          pointer-events: none;
          flex-grow: 0;
        `;
      case ItemStatusEnum.focus:
        return "width: 83px;";
      case ItemStatusEnum.edit:
        return "width: 79px;";
      case ItemStatusEnum.add:
        return "width: 35px;";
      default:
        break;
    }
  }}
`;

const ToolBtn = styled.button<{ color?: ColorEnum; active: boolean }>`
  font-size: 12px;
  margin-left: 0;
  width: 0;
  opacity: 0;
  pointer-events: none;

  color: ${(props) => {
    switch (props.color) {
      case ColorEnum.danger:
        return "rgba(229, 127, 127, 1)";
      case ColorEnum.confirm:
        return "#6AF190";
      default:
        return "#ffffff";
    }
  }};

  ${(props) => {
    if (props.active)
      return `
        margin-left: 12px;
        width: 100%;
        opacity: 1;
        pointer-events: all;
        transition: 0.3s;
      `;
  }}
`;

const FormItem = React.memo((props: FormItemProps) => {
  const { id_group, id, name = "", password = "", statusForce, setItem, addItem, readyToRemoveItem, setItemSetStatus } = props;
  const [status, setStatus] = useState<ItemStatusEnum>(statusForce || ItemStatusEnum.normal);

  const [itemName, setItemName] = useState<string>(name);
  const [itemPassword, setItemPassword] = useState<string>(password);

  const dispatch = useDispatch();
  const dragStatus = useSelector((state: RootState) => state.drag.status);

  function cancelEdit() {
    setItemName(name);
    setItemPassword(password);
  }

  function setDragData(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLDivElement;
    if (target.closest("button")?.getAttribute("color") === "confirm") return;
    dispatch(setType(DragTypeEnum.item));

    target.closest("[data-target=form-item]")?.id.includes("add")
      ? dispatch(setDragStatus(DragStatusEnum.normal))
      : dispatch(setDragStatus(DragStatusEnum.dragging));

    dispatch(setTargetItem({ id_group, id }));
  }

  return (
    <Item
      id={`item-${id}`}
      status={status}
      isFlash={dragStatus === DragStatusEnum.normal}
      data-target="form-item"
      onClick={() => {
        if (status === ItemStatusEnum.normal) {
          setStatus(ItemStatusEnum.focus);
          setItemSetStatus && setItemSetStatus({ setStatus, cancelEdit });
        }
      }}
    >
      <Order status={status} onMouseDown={setDragData}>
        <DragDots />
      </Order>
      <InputAddress
        active={status === ItemStatusEnum.edit || status === ItemStatusEnum.add}
        value={itemName}
        readOnly={status !== ItemStatusEnum.edit && status !== ItemStatusEnum.add}
        onInput={(e) => {
          setItemName((e.target as HTMLInputElement).value);
        }}
      />
      <InputPass
        active={status === ItemStatusEnum.edit || status === ItemStatusEnum.add}
        value={itemPassword}
        readOnly={status !== ItemStatusEnum.edit && status !== ItemStatusEnum.add}
        onInput={(e) => {
          setItemPassword((e.target as HTMLInputElement).value);
        }}
      />
      <Tools status={status}>
        <ToolBtn active={status === ItemStatusEnum.focus} onClick={() => setStatus(ItemStatusEnum.edit)}>
          Edit
        </ToolBtn>
        <ToolBtn active={status === ItemStatusEnum.focus} color={ColorEnum.danger} onClick={() => readyToRemoveItem && readyToRemoveItem({ id_group, id })}>
          Delete
        </ToolBtn>
        <ToolBtn
          active={status === ItemStatusEnum.edit}
          color={ColorEnum.confirm}
          onClick={() => {
            setStatus(ItemStatusEnum.normal);
            setItem && setItem({ id, name: itemName, password: itemPassword });
            setItemSetStatus && setItemSetStatus({ cancelEdit: () => {} });
          }}
        >
          OK
        </ToolBtn>
        <ToolBtn
          active={status === ItemStatusEnum.edit}
          color={ColorEnum.danger}
          onClick={() => {
            setStatus(ItemStatusEnum.normal);
            cancelEdit();
          }}
        >
          Cancel
        </ToolBtn>
        <ToolBtn
          active={status === ItemStatusEnum.add}
          color={ColorEnum.confirm}
          onClick={() => {
            if (itemName.length < 1 || itemPassword.length < 1 || !addItem) return;
            addItem({ id_group, name: itemName, password: itemPassword });
            setItemName("");
            setItemPassword("");
          }}
        >
          Add
        </ToolBtn>
      </Tools>
    </Item>
  );
});

const FormItemGroupName = React.memo((props: FormItemGroupProps) => {
  const { id, name, setGroup, setItemSetStatus, readyToRemoveGroup } = props;
  const [status, setStatus] = useState(ItemStatusEnum.normal);

  const dispatch = useDispatch();

  const [groupName, setGroupName] = useState(name);

  function setDragData() {
    dispatch(setType(DragTypeEnum.group));
    dispatch(setDragStatus(DragStatusEnum.dragging));
    dispatch(setTargetItem({ id_group: id }));
  }

  function cancelEdit() {
    setGroupName(name);
  }

  return (
    <ItemGroupName
      data-target="form-item"
      onClick={() => {
        if (status === ItemStatusEnum.normal) {
          setStatus(ItemStatusEnum.focus);
          setItemSetStatus && setItemSetStatus({ setStatus, cancelEdit });
        }
      }}
    >
      <Order status={status} onMouseDown={setDragData}>
        <DragDots />
      </Order>
      <InputGroupName
        active={status === ItemStatusEnum.edit}
        value={groupName}
        readOnly={status !== ItemStatusEnum.edit}
        onInput={(e) => {
          setGroupName((e.target as HTMLInputElement).value);
        }}
      />
      <Tools status={status}>
        <ToolBtn active={status === ItemStatusEnum.focus} onClick={() => setStatus(ItemStatusEnum.edit)}>
          Edit
        </ToolBtn>
        <ToolBtn
          active={status === ItemStatusEnum.focus}
          color={ColorEnum.danger}
          onClick={() => {
            readyToRemoveGroup && readyToRemoveGroup({ id });
          }}
        >
          Delete
        </ToolBtn>
        <ToolBtn
          active={status === ItemStatusEnum.edit}
          color={ColorEnum.confirm}
          onClick={() => {
            setStatus(ItemStatusEnum.normal);
            setGroup({ id, name: groupName });
            setItemSetStatus && setItemSetStatus({ cancelEdit: () => {} });
          }}
        >
          OK
        </ToolBtn>
        <ToolBtn
          active={status === ItemStatusEnum.edit}
          color={ColorEnum.danger}
          onClick={() => {
            setStatus(ItemStatusEnum.normal);
            cancelEdit();
          }}
        >
          Cancel
        </ToolBtn>
      </Tools>
    </ItemGroupName>
  );
});
export { FormItemGroupName, FormItem };
