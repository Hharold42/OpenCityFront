const Popup = ({ title, text, type, controller }) => {
  return (
    <div
      className="w-full h-full absolute top-0 bottom-0 flex justify-center items-center"
      onClick={() => controller()}
    >
      <div
        className={` w-[800px] bg-[#2B2D3D] rounded-xl flex flex-col border-4 border-solid px-8 py-4 ${
          type === "error" && "border-[#FF6363]"
        } ${type === "success" && " border-[#86FF73]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <label className="text-2xl font-bold border-b border-solid">
          {title}
        </label>
        <div className="my-4 bg-[#4b4b4b41] px-4 py-2">{text}</div>
        <button
          className="ft_button bottom-0 w-full"
          onClick={() => controller()}
        >
          Окей
        </button>
      </div>
    </div>
  );
};

export default Popup;
