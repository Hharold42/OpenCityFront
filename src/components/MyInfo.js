import { Link } from "react-router-dom";

const MyInfo = () => {
  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
        <div className="w-full h-[300px] bg-[#2B2D3D] my-2 rounded-md flex flex-col justify-evenly items-center">
          <div className="flex flex-row items-center">
            <Link className="ft_button" to={"/changeemail"}>
              Сменить почту
            </Link>
          </div>
          <div className="flex flex-row items-center">
            <Link className="ft_button" to={"/changepass"}>
              Сменить пароль
            </Link>
          </div>
        </div>
        <div className="w-full h-[300px] bg-[#2B2D3D] my-2 rounded-md flex flex-col justify-evenly items-center">
          <div className="flex flex-row items-center">
            <Link className="ft_button" to={"/events/user"}>
              Мои события
            </Link>
          </div>
          <div className="flex flex-row items-center">
            <Link className="ft_button" to={"/community/user"}>
              Мои сообщества
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfo;
