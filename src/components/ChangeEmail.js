import { useState } from "react";
import { changeEmail } from "../utils/controllers/userController";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState();
  const [modal, setModal] = useState({
    text: "",
    title: "",
    type: "",
    active: false,
  });

  const closeModalController = () => {
    setModal({ ...modal, active: false });
  };

  const { session, setSession, user, setUser } = useUser();
  const navigate = useNavigate();

  const confirm = async () => {
    if (newEmail) {
      console.log(newEmail, user.email);
      if (user.email === newEmail) {
        setModal({
          text: "Старый и новый email не должны совпадать",
          title: "Ошибка",
          type: "error",
          active: true,
        });
        return;
      }

      const res = await changeEmail(session, user.email, newEmail);

      localStorage.removeItem("opencity-token");
      setSession("");
      setUser(null);
      navigate("/login");
      // setModal({
      //   active: true,
      //   text: "Email изменен успешно",
      //   type: "success",
      //   title: "Успешно",
      // });
      // setTimeout(() => {
      //   setUser(null);
      //   navigate("/login");
      // }, 3000);
    }
  };

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
        <label className="ft_title">Изменить электроннуй почту</label>
        <div className="field_max">
          <label className="ft_field-label">Новый Email:</label>
          <input
            type="text"
            className="ft_input"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>
        <button className="ft_button self-start" onClick={confirm}>
          Сменить
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

export default ChangeEmail;
