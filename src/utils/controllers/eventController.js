import axios from "axios";

const eventBaseUrl = "http://localhost:8080/api/event";

export const getAllActiveEvent = async (token) => {
  return await axios
    .get(eventBaseUrl + "/all/active", {})
    .then((res) => res.data);
};

export const getAllEventsByStatus = async (token, status) => {
  return await axios
    .get(`${eventBaseUrl}/all/status/${status}`, {
      headers: {
        token: token,
      },
    })
    .then((res) => res.data);
};

export const getEventById = async (token, id) => {
  return await axios
    .get(`${eventBaseUrl}/get/${id}`, {
      headers: {
        token: token,
      },
    })
    .then((res) => res.data);
};

export const updateEvent = async (token, id, updatedEvent) => {
  return await axios
    .put(`${eventBaseUrl}/update/${id}`, updatedEvent, {
      headers: {
        token: token,
      },
    })
    .then((res) => (res.data.length > 0 ? 1 : 0));
};

export const deleteEvent = async (token, id) => {
  return await axios
    .delete(`${eventBaseUrl}/${id}`, {
      headers: { token: token },
    })
    .then((res) => res.data);
};

export const getMyEventsByStatus = async (status, token) => {
  return await axios
    .get(`${eventBaseUrl}/all/my/status/${status}`, {
      headers: { token: token },
    })
    .then((res) => res.data);
};
