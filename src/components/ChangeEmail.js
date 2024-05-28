import { useState } from "react";
import { changeEmail } from "../utils/controllers/userController";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";

const ChangeEmail = () => {
  const [oldEmail, setOldEmail] = useState();
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

  const { session, setSession, user } = useUser();
  const navigate = useNavigate();

  const confirm = async () => {
    console.log(user);
    if (oldEmail && newEmail) {
      if (oldEmail === newEmail) {
        setModal({
          text: "Старый и новый email не должны совпадать",
          title: "Ошибка",
          type: "error",
          active: true,
        });
        return;
      }

      if (oldEmail !== user.email) {
        setModal({
          text: "Старый email не совпадает с вашим текущим email",
          title: "Ошибка",
          type: "error",
          active: true,
        });
        return;
      }

      const res = await changeEmail(session, oldEmail, newEmail);
      if (res.split("$")[0] === newEmail) {
        localStorage.removeItem("opencity-token");
        setSession("");
        setModal({
          active: true,
          text: "Email изменен успешно",
          type: "success",
          title: "Успешно",
        });
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        alert(res);
      }
    }
  };

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
      <label className="ft_title">Изменить электроннуй почту</label>
        <div className="field_max">
          <label className="ft_field-label">Старый Email:</label>
          <input
            type="text"
            className="ft_input"
            value={oldEmail}
            onChange={(e) => setOldEmail(e.target.value)}
          />
        </div>
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
