import axios from "axios";

const reportBaseUrl = "http://localhost:8080/api/report";

const types = ["event", "community"];

export const createReport = async (token, description, type, id) => {
  return await axios.post(
    `${reportBaseUrl}/add/${types[type]}/${id}`,
    {
      description: description,
    },
    {
      headers: {
        token: token,
      },
    }
  );
};

export const getReportsByTypeAndId = async (token, type, id) => {
  return await axios
    .get(`${reportBaseUrl}/getall/${types[type]}/${id}`, {
      headers: { token: token },
    })
    .then((res) => res.data);
};
