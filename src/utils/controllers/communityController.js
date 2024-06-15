import axios from "axios";

const communityBaseUrl = "http://localhost:8080/api/community";

export const createCommunity = async (data, token) => {
  return await axios
    .post(`${communityBaseUrl}/create`, data, {
      headers: {
        token: token,
      },
    })
    .then((res) => res.data);
};

export const getAllActiveCommunities = async (token) => {
  return await axios
    .get(`${communityBaseUrl}/all/active`, {
      headers: {
        token: token,
      },
    })
    .then((res) => res.data);
};

export const getAllCommunitiesByStatus = async (token, status) => {
  return await axios
    .get(`${communityBaseUrl}/all/status/${status}`, {
      headers: {
        token: token,
      },
    })
    .then((res) => res.data);
};

export const getCommunityById = async (id) => {
  return await axios
    .get(`${communityBaseUrl}/get/${id}`, {})
    .then((res) => res.data);
};

export const updateCommunity = async (token, id, data) => {
  return await axios
    .put(`${communityBaseUrl}/update/${id}`, data, {
      headers: {
        token: token,
      },
    })
    .then((res) => (res.data.length > 0 ? 1 : 0));
};

export const deleteCommunity = async (token, id) => {
  return await axios
    .delete(`${communityBaseUrl}/${id}`, {
      headers: {
        token: token,
      },
    })
    .then((res) => res.data);
};

export const getMyCommunitiesByStatus = async (status, token) =>
  await axios
    .get(`${communityBaseUrl}/all/my/status/${status}`, {
      headers: {
        token: token,
      },
    })
    .then((res) => res.data);
