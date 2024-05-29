import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { getAllReports } from "../../utils/controllers/reportContorller";
import RenderAdmReports from "./RenderAdmReports";

const AdmReports = () => {
  const [reports, setReports] = useState();
  const { session, user } = useUser();

  const navigate = useNavigate();

  if (user) {
    if (user.role === "user") {
      navigate("/");
    }
  }

  useEffect(() => {
    if (!reports && session)
      getAllReports(session).then((data) => {
        setReports(
          data.map((item, index) => (
            <RenderAdmReports
              key={index}
              id={item.id}
              entId={item.entityId}
              entType={item.type}
              description={item.description}
              user={item.user}
              controller={setReports}
            />
          ))
        );
      });
  }, [reports, session]);

  return (
    <div className="page-wrap">
      <div className="flex flex-col w-[1000px] px-4 py-2">
        <label className="ft_title">Жалобы</label>
        {reports && reports}
      </div>
    </div>
  );
};

export default AdmReports;
