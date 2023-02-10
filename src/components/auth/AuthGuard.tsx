import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Api from "../../resource/api";

const LogoutBtn = styled.button`
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px 12px;
  background-color: #ea4c88;
  border-radius: 4px;
  color: white;
  transition: 0.4s background-color;

  &:hover {
    background-color: #d44179;
  }
`;

function AuthGuard() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  Api.$axios.interceptors.response.use(
    (res) => {
      setIsLogin(true);
      return res;
    },
    (err) => {
      err.response?.status === 401 && logout();
      err.code === "ERR_NETWORK" && setIsLogin(false);
      throw err;
    }
  );

  function logout() {
    const CCtoken = axios.CancelToken.source();
    Api.logout(CCtoken.token)
      .then()
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLogin(false);
      });
  }

  useEffect(() => {
    if (!isLogin) {
      navigate("/");
    }
  }, [isLogin, navigate]);

  return (
    <>
      <Outlet />
      <LogoutBtn onClick={logout}>logout</LogoutBtn>
    </>
  );
}

export default AuthGuard;
