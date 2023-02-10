import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { FormItem, FormItemGroupName } from "../components/FormItem";
import Modal from "../components/Modal";
import DragStatusEnum from "../enum/dragStatus";
import ItemStatusEnum from "../enum/itemStatus";
import useDrag from "../hook/useDrag";
import Api from "../resource/api";
import { RootState } from "../store";
import { GroupData } from "../type/form";
import { ModalDetail } from "../type/modal";

type CardProps = {
  key?: number;
  selected?: boolean;
  isFlash?: boolean;
};

interface ItemStatus {
  isUpdate: boolean | null;
  old: Function | null;
  new: Function | null;
  cancelEdit: Function | null;
}

const Layout = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1600px;
  padding: 40px 24px;
  margin: auto;
`;

const Card = styled.div<CardProps>`
  padding: 16px;
  padding-top: 12px;
  margin-left: 12px;
  margin-right: 12px;
  margin-bottom: 24px;
  width: 360px;
  height: fit-content;
  border-radius: 8px;
  background-color: #3b4148;
  box-shadow: ${(props) => (props.selected ? " 0px 0px 8px 2px rgba(255, 255, 255, 0.25);" : "none")};
  transition: ${(props) => (props.isFlash ? "0" : "0.3s")};

  &.dragging-group * {
    user-select: none;
    cursor: grabbing;
  }
`;

const CardNew = styled(Card)`
  padding-top: 48px;
  padding-bottom: 48px;
  display: flex;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  border: 2px dashed #565f68;
  cursor: pointer;
`;

const CardFixed = styled(Card)`
  opacity: 0;
  pointer-events: none;
`;

function Account() {
  const [safety, setSafety] = useState<GroupData[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [fixedCardtotal, setfixedCardtotal] = useState<number>(0);

  const activeItem = useRef<Element | null>(null);
  const itemSetStatus = useRef<ItemStatus>({ isUpdate: null, old: null, new: null, cancelEdit: null });

  const [modalActive, setModalActive] = useState<boolean>(false);
  const modalDetail = useRef<ModalDetail>({ message: "", confirmType: "confirm", cancelType: "danger", confirm: () => {}, cancel: () => {} });

  const { dragStartHandler, draggingHandler, releaseDrag } = useDrag({ safety, setSafety });

  const dragCardId = useSelector((state: RootState) => state.drag.cardId);
  const dragStatus = useSelector((state: RootState) => state.drag.status);

  // demo func

  async function addGroup() {
    const CCtoken = axios.CancelToken.source();
    try {
      const { data } = await Api.addGroup(CCtoken.token);
      setSafety((prev) => {
        let newState = [...prev];
        newState.push({ id: data.id, group_name: data.name, items: [], order: data.order, created_on: data.created_on });
        return newState;
      });
    } catch (err) {
      console.log(err);
    }
    return;
  }

  async function setGroup({ id, name }: { id: number; name: string }) {
    const CCtoken = axios.CancelToken.source();
    try {
      const { data } = await Api.setGroup(id, { name }, CCtoken.token);
      setSafety((prev) => {
        let newState = [...prev];
        const i = newState.findIndex((el) => el.id === data.id);
        newState[i].group_name = data.name;
        return newState;
      });
    } catch (err) {
      console.log(err);
    }
  }

  function readyToRemoveGroup({ id }: { id: number }) {
    setModalActive(true);

    modalDetail.current = {
      ...modalDetail.current,
      message: 'Are you sure to Delete "Group" ?',
      confirmType: "danger",
      confirm: () => {
        removeGroup({ id });
      },
    };
  }

  async function removeGroup({ id }: { id: number }) {
    const CCtoken = axios.CancelToken.source();
    try {
      const { data } = await Api.removeGroup(id, CCtoken.token);
      setSafety((prev) => {
        let newState = [...prev];
        newState = newState.filter((el) => el.id !== data.id);
        return newState;
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function addItem({ id_group, name, password }: { id_group: number; name: string; password: string }) {
    const CCtoken = axios.CancelToken.source();
    try {
      const { data } = await Api.addItem({ id_group, name, password }, CCtoken.token);
      setSafety((prev) => {
        let newState = [...prev];
        const i = newState.findIndex((el) => el.id === data.safety_group_id);
        newState[i].items.push({
          id: data.id,
          safety_group_id: data.safety_group_id,
          name: data.name,
          password: data.password,
          order: data.order,
          created_on: data.created_on,
        });
        return newState;
      });
    } catch (err) {
      console.log(err);
    }
    return;
  }

  async function setItem({ id, name, password }: { id: number; name: string; password: string }) {
    const CCtoken = axios.CancelToken.source();
    try {
      const { data } = await Api.setItem(id, { name, password }, CCtoken.token);
      setSafety((prev) => {
        let newState = [...prev];
        const i = newState.findIndex((el) => el.id === data.safety_group_id);
        const j = newState[i].items.findIndex((el) => el.id === data.id);
        newState[i].items[j].name = data.name;
        newState[i].items[j].password = data.password;
        return newState;
      });
    } catch (err) {
      console.log(err);
    }
  }

  function readyToRemoveItem({ id }: { id: number }) {
    setModalActive(true);

    modalDetail.current = {
      ...modalDetail.current,
      message: 'Are you sure to Delete "item" ?',
      confirmType: "danger",
      confirm: () => {
        removeItem({ id });
      },
    };
  }

  async function removeItem({ id }: { id: number }) {
    const CCtoken = axios.CancelToken.source();
    try {
      const { data } = await Api.removeItem(id, CCtoken.token);
      setSafety((prev) => {
        let newState = [...prev];
        const i = newState.findIndex((el) => el.id === data.safety_group_id);
        newState[i].items = newState[i].items.filter((item) => item.id !== data.id);
        return newState;
      });
    } catch (err) {
      console.log(err);
    }
  }

  function setItemSetStatus(methods = { setStatus: itemSetStatus.current.old, cancelEdit: () => {} }) {
    itemSetStatus.current = { ...itemSetStatus.current, isUpdate: true, new: methods.setStatus, cancelEdit: methods.cancelEdit };
  }

  function itemActiveHandler(e: MouseEvent) {
    const target = (e.target as HTMLDivElement).closest("[data-target=form-item]");

    if (activeItem.current !== null && target !== activeItem.current && itemSetStatus.current.cancelEdit) {
      itemSetStatus.current.old && itemSetStatus.current.old("normal");
      itemSetStatus.current.cancelEdit();
    }

    if (itemSetStatus.current.isUpdate) {
      itemSetStatus.current.old = itemSetStatus.current.new;
      itemSetStatus.current.isUpdate = false;
      activeItem.current = target;
    }
  }

  function cardSelectedHandler(e: MouseEvent) {
    const target = (e.target as HTMLDivElement).closest("[data-target=form-card]");
    !target && setSelectedCard(null);
  }

  const fixCardPosition = useCallback(() => {
    if (window.innerWidth < 1200) return setfixedCardtotal(0);
    const length = safety.length + 1;
    switch (length % 3) {
      case 0:
        break;
      case 1:
        setfixedCardtotal(2);
        break;
      case 2:
        setfixedCardtotal(1);
        break;
      default:
        break;
    }
  }, [safety.length]);

  useEffect(() => {
    const CCtoken = axios.CancelToken.source();
    Api.getSafeties(CCtoken.token)
      .then((res) => {
        const { data } = res;
        setSafety(data);
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== "development" && err.name === "CanceledError") return;
        console.log(err);
      });

    fixCardPosition();

    return () => {
      CCtoken.cancel();
    };
  }, [fixCardPosition]);

  useEffect(() => {
    window.addEventListener("click", cardSelectedHandler);
    window.addEventListener("click", itemActiveHandler);

    window.addEventListener("mousedown", dragStartHandler);
    window.addEventListener("mousemove", draggingHandler);
    window.addEventListener("mouseup", releaseDrag);
    window.addEventListener("mouseleave", releaseDrag);

    return () => {
      window.removeEventListener("click", cardSelectedHandler);
      window.removeEventListener("click", itemActiveHandler);

      window.removeEventListener("mousedown", dragStartHandler);
      window.removeEventListener("mousemove", draggingHandler);
      window.removeEventListener("mouseup", releaseDrag);
      window.removeEventListener("mouseleave", releaseDrag);
    };
  }, [dragStartHandler, releaseDrag, draggingHandler]);

  return (
    <div className="account">
      <Layout className="account__layout">
        {safety.map((el, key) => {
          return (
            <Card
              id={`group-${el.id}`}
              className={dragCardId === el.id ? "dragging-group" : ""}
              isFlash={dragStatus === DragStatusEnum.normal}
              data-target="form-card"
              selected={el.id === selectedCard}
              key={el.id as number}
              onClick={() => setSelectedCard(el.id)}
            >
              <FormItemGroupName
                id={el.id}
                name={el.group_name}
                setGroup={setGroup}
                setItemSetStatus={setItemSetStatus}
                readyToRemoveGroup={readyToRemoveGroup}
              ></FormItemGroupName>
              {el.items.map((f) => {
                return (
                  <FormItem
                    id_group={el.id}
                    id={f.id}
                    name={f.name}
                    password={f.password}
                    key={f.id}
                    setItem={setItem}
                    readyToRemoveItem={readyToRemoveItem}
                    setItemSetStatus={setItemSetStatus}
                  />
                );
              })}
              <FormItem id={`add-${key}`} id_group={el.id} statusForce={ItemStatusEnum.add} addItem={addItem} />
            </Card>
          );
        })}
        <CardNew onClick={addGroup}>
          <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="32" height="32">
            <path
              fill="#565f68"
              fillOpacity={0.8}
              d="M 24 4 C 12.972066 4 4 12.972074 4 24 C 4 35.027926 12.972066 44 24 44 C 35.027934 44 44 35.027926 44 24 C 44 12.972074 35.027934 4 24 4 z M 24 7 C 33.406615 7 41 14.593391 41 24 C 41 33.406609 33.406615 41 24 41 C 14.593385 41 7 33.406609 7 24 C 7 14.593391 14.593385 7 24 7 z M 23.976562 13.978516 A 1.50015 1.50015 0 0 0 22.5 15.5 L 22.5 22.5 L 15.5 22.5 A 1.50015 1.50015 0 1 0 15.5 25.5 L 22.5 25.5 L 22.5 32.5 A 1.50015 1.50015 0 1 0 25.5 32.5 L 25.5 25.5 L 32.5 25.5 A 1.50015 1.50015 0 1 0 32.5 22.5 L 25.5 22.5 L 25.5 15.5 A 1.50015 1.50015 0 0 0 23.976562 13.978516 z"
            />
          </svg>
        </CardNew>
        {Array(fixedCardtotal)
          .fill(true)
          .map((el, i) => (
            <CardFixed key={i}></CardFixed>
          ))}
      </Layout>
      {modalActive && <Modal setModalActive={setModalActive} detail={modalDetail.current} />}
    </div>
  );
}

export default Account;
