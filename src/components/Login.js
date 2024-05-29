import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import Popup from "./Popup";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState({
    text: "",
    title: "",
    type: "",
    active: false,
  });

  const { session, setSession } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate("/");
  }, [session, navigate]);

  const handleRegister = async () => {
    if (!email) {
      alert("Пожалуйста введите почту");
      return;
    }
    if (!password) {
      alert("Пожалуйста введите пароль");
      return;
    }

    try {
      await axios
        .post(
          `http://localhost:8080/api/user/signin?userEmail=${email}&userPassword=${password}`
        )
        .then((res) => res.data)
        .then((data) => {
          localStorage.setItem("opencity-token", data);
          setSession(data);
          navigate("/");
        });
    } catch (e) {
      setModal({
        text: "Неправильный логин или пароль",
        title: "Ошибка",
        type: "error",
        active: true,
      });
      setEmail("");
      setPassword("");
    }
  };

  const closeModalController = () => {
    setModal({ ...modal, active: false });
  };

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
        <label className="ft_title">Войти</label>
        <div className="field_max">
          <label className="ft_field-label">Эл. почта:</label>
          <input
            type="text"
            className="ft_input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field_max">
          <label className="ft_field-label">Пароль:</label>
          <input
            type="text"
            className="ft_input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="ft_button self-start" onClick={handleRegister}>
          Войти
        </button>
      </div>
      {modal.active && (
        <Popup
          text={modal.text}
          title={modal.title}
          type={modal.type}
          controller={closeModalController}
        />
      )}
    </div>
  );
};

export default Login;
