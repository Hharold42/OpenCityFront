import React, { useEffect, useState } from "react";
import { getUserEmailById } from "../../utils/controllers/userController";
import { useUser } from "../../context/userContext";
import { FaX } from "react-icons/fa6";
import { deleteReport } from "../../utils/controllers/reportContorller";

const RenderReport = ({
  id,
  description,
  author,
  del = false,
  controller,
  entType,
}) => {
  // const [userName, setUserName] = useState("");

  const { session } = useUser();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const res = await getUserEmailById(session, author);

  //     setUserName(res);
  //   };

  //   if (!userName && session) fetchUser();
  // }, [userName, author, session]);

  return (
    <tr className=" border-b border-white [&>*]:py-2 [&>*]:border [&>*]:border-white">
      <td className="items-center px-4">{author}</td>
      <td className="items-center px-4 break-all">{description}</td>
      <td className="items-center px-4">{id}</td>
      {del && (
        <td
          className=" items-center px-4 cursor-pointer"
          onClick={() => {
            deleteReport(session, id, entType).then(() => {
              controller(null);
            });
          }}
        >
          <FaX color="#FF6363" />
        </td>
      )}
    </tr>
  );
};

export default RenderReport;
