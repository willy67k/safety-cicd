import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Api from "../resource/api";
import { FormUser } from "../type/form";

type InputProps = {
  autocomplete?: string;
  value: string;
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
`;

const Filed = styled.div`
  width: 320px;
`;

const Label = styled.label`
  display: flex;
  width: 100%;
`;

const Icon = styled.span`
  flex-shrink: 0;
  display: inline-block;
  padding: 20px;
  width: 54px;
  height: 54px;
  background-color: #363b41;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const Input = styled.input<InputProps>`
  flex-grow: 1;
  margin-bottom: 16px;
  padding: 16px;
  height: 54px;
  background-color: #3b4148;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  color: white;
  font-size: 14px;
  transition: 0.4s background-color;

  &:hover,
  &:focus {
    background-color: #434a52;
  }
`;

const Button = styled.button`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  width: 100%;
  background-color: #ea4c88;
  border-radius: 4px;
  color: white;
  transition: 0.4s background-color;

  &:hover {
    background-color: #d44179;
  }
`;

const MSG = styled.p`
  height: 24px;
  color: rgba(229, 127, 127, 1);
  text-align: right;
`;

function Home() {
  const form = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<FormUser>({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string>("");

  function setForm(e: React.FormEvent<HTMLInputElement>) {
    setValues((prev) => {
      const newVal = { ...prev };
      const target = e.target as HTMLInputElement;
      const keyName = target.name;
      if (keyName === "username" || keyName === "password") {
        newVal[keyName] = target.value;
      }
      return newVal;
    });
  }

  async function login({ username, password }: FormUser) {
    const CCtoken = axios.CancelToken.source();
    setErrorMsg("");
    try {
      await Api.login({ username, password }, CCtoken.token);
      navigate("/account");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setErrorMsg(err.response.data.error);
      }
      console.log(err);
    }
    return;
  }

  useEffect(() => {
    form.current!.style.height = window.innerHeight + "px";
  }, []);

  return (
    <div className="home">
      <Form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          login(values);
        }}
        ref={form}
      >
        <Filed>
          <Label>
            <Icon>
              <svg className="icon" fill="#606468" style={{ width: "100%", height: "100%" }}>
                <use xlinkHref="#icon-user"></use>
              </svg>
            </Icon>
            <Input
              autocomplete="username"
              type="text"
              name="username"
              className="form__input"
              placeholder="Username"
              required
              value={values.username}
              onInput={setForm}
            />
          </Label>
        </Filed>

        <Filed>
          <Label>
            <Icon>
              <svg className="icon" fill="#606468" style={{ width: "100%", height: "100%" }}>
                <use xlinkHref="#icon-lock"></use>
              </svg>
            </Icon>
            <Input type="password" name="password" className="form__input" placeholder="Password" required value={values.password} onInput={setForm} />
          </Label>
        </Filed>

        <Filed>
          <Button type="submit">SUBMIT</Button>
        </Filed>

        <Filed>
          <MSG>{errorMsg}</MSG>
        </Filed>

        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
          <symbol id="icon-lock" viewBox="0 0 1792 1792">
            <path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z" />
          </symbol>
          <symbol id="icon-user" viewBox="0 0 1792 1792">
            <path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z" />
          </symbol>
        </svg>
      </Form>
    </div>
  );
}

export default Home;
