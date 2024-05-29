import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import Popup from "./Popup";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState({
    text: "",
    title: "",
    type: "",
    active: false,
  });

  const { session, setSession, setUser } = useUser();

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

    const data = {
      email: email,
      password: password,
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/user/create",
        data
      );
      // .then((res) => res)
      // .then((data) => {
      //   localStorage.setItem("opencity-token", data);
      //   setSession(data);
      //   navigate("/");
      // });

      if (res.status === 409) {
        setModal({
          text: "Такой пользователь уже существует",
          title: "Ошибка",
          type: "error",
          active: true,
        });
        setEmail("");
      } else {
        


        localStorage.setItem("opencity-token", res.data);
        setSession(res.data);
        navigate("/");
        // setUser(null);
      }
    } catch (e) {
      setModal({
        text: "Такой пользователь уже существует",
        title: "Ошибка",
        type: "error",
        active: true,
      });
      setEmail("");
    }
  };

  const closeModalController = () => {
    setModal({ ...modal, active: false });
  };

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
        <label className="ft_title">Регистрация</label>
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
          Зарегистрироваться
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

export default Register;
