import axios from "axios";

const photoBaseUrl = "http://localhost:8080/api/photo";

export const uploadPhotoByEvenId = async (token, id, formData) => {
  return await axios
    .post(`${photoBaseUrl}/event/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: token,
        responseType: "blob",
      },
    })
    .then((res) => res.data);
};

export const uploadPhotoByCommunityId = async (token, id, formData) => {
  return await axios.post(`${photoBaseUrl}/community/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      token: token,
      responseType: "blob",
    },
  });
};

export const getPhotoIdById = async (id, type = 0) => {
  return await axios
    .get(`${photoBaseUrl}/all/by-id-and-type/${id}?type=${type}`)
    .then((res) => (res.data.length > 0 ? res.data[0] : false));
};

export const getPhotoUrlById = async (id) => {
  return await axios
    .get(`${photoBaseUrl}/${id}`, {
      responseType: "arraybuffer",
    })
    .then((res) => {
      const blob = new Blob([res.data], { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(blob);

      return imageUrl;
    });
};

export const deletePhotoById = async (id) => {
  return await axios.delete(`${photoBaseUrl}/${id}`).then((res) => res.data);
};
