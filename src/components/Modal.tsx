import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { ModalDetail } from "../type/modal";

type ModalProps = {
  setModalActive: Dispatch<SetStateAction<boolean>>;
  detail: ModalDetail;
};

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(44, 51, 56, 0.8);
`;

const Popup = styled.div`
  width: 100%;
  max-width: 360px;
  border-radius: 12px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 1);
`;

const Message = styled.p`
  color: #454572;
  margin-bottom: 24px;
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  color: ${(props) => (props.color === "danger" ? "rgba(229, 127, 127, 1)" : props.color === "confirm" ? "#6AF190" : "#878799")};
  margin-left 12px;
    padding: 2px 4px;
  `;

function Modal(props: ModalProps) {
  const { setModalActive, detail } = props;

  return (
    <Wrapper
      onClick={(e) => {
        setModalActive(false);
      }}
    >
      <Popup
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Message>{detail.message}</Message>
        <Row>
          <Button
            color={detail.confirmType}
            onClick={() => {
              setModalActive(false);
              typeof detail.confirm === "function" && detail.confirm();
            }}
          >
            Sure
          </Button>
          <Button
            color={detail.cancelType}
            onClick={() => {
              setModalActive(false);
              typeof detail.cancel === "function" && detail.cancel();
            }}
          >
            No
          </Button>
        </Row>
      </Popup>
    </Wrapper>
  );
}

export default Modal;
