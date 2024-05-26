import axios from "axios";

const userBaseUrl = "http://localhost:8080/api/user";

export const getUserByToken = async (token) => {
  return await axios
    .get(userBaseUrl + "/token", {
      headers: {
        token: token,
      },
    })
    .then((res) => res.data);
};

export const getUserEmailById = async (token, id) => {
  return await axios
    .get(`${userBaseUrl}/${id}`, {
      headers: {
        token: token,
      },
    })
    .then((res) => res.data.email);
};

export const changeEmail = async (token, oe, ne) => {
  return await axios
    .put(
      `${userBaseUrl}/update/email?oldEmail=${oe}&newEmail=${ne}`,
      {},
      {
        headers: {
          token: token,
        },
      }
    )
    .then((res) => res.data);
};

export const changePassword = async (token, ue, np) => {
  return await axios
    .put(
      `${userBaseUrl}/update/password?userEmail=${ue}&newPassword=${np}`,
      {},
      {
        headers: {
          token: token,
        },
      }
    )
    .then((res) => res.data);
};

export const getAllUsers = async (token) =>
  await axios
    .get(`${userBaseUrl}/all`, {
      headers: {
        token: token,
      },
    })
    .then((res) => res.data);

export const chagneRole = async (token, email, role) =>
  await axios.put(
    `${userBaseUrl}/update/role?userEmail=${email}&newRole=${role}`,
    {},
    {
      headers: {
        token: token,
      },
    }
  );
