import { useState } from "react";
import { useUser } from "../../context/userContext";
import { createCommunity } from "../../utils/controllers/communityController";
import {
  uploadPhotoByCommunityId,
  uploadPhotoByEvenId,
} from "../../utils/controllers/photoController";

const tags = [
  { value: "0", text: "Танцы" },
  { value: "1", text: "Вокал" },
  { value: "2", text: "Музыка" },
  { value: "3", text: "Настолки" },
  { value: "4", text: "Фестиваль" },
  { value: "5", text: "Спорт" },
  { value: "6", text: "Интелектуальное соревнование" },
  { value: "7", text: "Культура" },
  { value: "8", text: "Другое" },
];

const CreateCommunity = () => {
  const [data, setData] = useState({
    title: "",
    description: "",
    contact_info: "",
    tag: "0",
  });
  const [image, setImage] = useState();
  const [error, setError] = useState();
  const { session } = useUser();

  const handleChangeField = (field) => (e) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAddFile = (e) => {
    const file = e.target.files[0];
    if (file);
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage(file);
        setError("");
      } else {
        setImage(null);
        setError("Файл должен быть изображением.");
      }
    }
  };

  const isFormComplete = () => {
    for (const key in data) {
      if (data[key] === "") {
        return false;
      }
    }
    return true;
  };

  const confirm = async (e) => {
    e.preventDefault();

    if (!isFormComplete()) {
      alert("Заполните все поля!");
      return;
    }

    const newCommunityId = await createCommunity(data, session);

    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      await uploadPhotoByCommunityId(session, newCommunityId, formData);
    }

    setData({
      title: "",
      description: "",
      contact_info: "",
      tag: "0",
    });
  };

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
        <label className="ft_title">Создать сообщества</label>
        <div className="field_max">
          <label className="ft_field-label">Название:</label>
          <input
            type="text"
            className="ft_input"
            value={data.title}
            onChange={handleChangeField("title")}
          />
        </div>
        <div className="field_max">
          <label className="ft_field-label">Описание:</label>
          <textarea
            type="text"
            className="ft_input"
            value={data.description}
            onChange={handleChangeField("description")}
          />
        </div>
        <div className="field_max">
          <label className="ft_field-label">Контактная информация:</label>
          <input
            type="text"
            className="ft_input"
            value={data.contact_info}
            onChange={handleChangeField("contact_info")}
          />
        </div>
        <div className="field_max">
          <label className="ft_field-label">Тэг:</label>
          <select
            className="ft_input"
            value={data.tag}
            onChange={handleChangeField("tag")}
          >
            {tags.map((tag, index) => (
              <option key={index} value={tag.value}>
                {tag.text}
              </option>
            ))}
          </select>
        </div>
        <div className="field_max">
          <label className="ft_field-label">Файл:</label>
          <input type="file" className="ft_input" onChange={handleAddFile} />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <button className="ft_button self-start" onClick={confirm}>
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};

export default CreateCommunity;
