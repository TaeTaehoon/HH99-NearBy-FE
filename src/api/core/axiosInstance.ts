import axios from "axios";
import apis from "../api";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URI,
});

instance.interceptors.request.use(
  (req) => {
    const accessToken =
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbmZkdWZkbEBuYXZlci5jb20iLCJhdXRoIjoibWVtYmVyIiwiZXhwIjoxNjYyNDYyNTQ4fQ.kvjvYs55RJu8dY5k4D1RsZzUcrNynPNJL3zkzkiuY2k";
    if (typeof accessToken === "string" && typeof req.headers !== "undefined") {
      req.headers.authorization = accessToken;
    }
    return req;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  function (res) {
    return res;
  },
  async function (error) {
    try {
      const originalRequest = error.config;
      let requestRes;
      let refreshToken;
      if (typeof localStorage.getItem("refreshtoken") === "string") {
        refreshToken = localStorage.getItem("refreshtoken");
      }
      if (typeof refreshToken === "string") {
        requestRes = await apis.reissue(refreshToken);
        localStorage.setItem("accessToken", requestRes.authorization);
        localStorage.setItem("refreshtoken", requestRes["refresh-token"]);
        originalRequest.headers["Authorization"] = requestRes.authorization;
      }
      return await instance.request(originalRequest);
    } catch (error) {
      localStorage.removeItem("accessToken");
      return console.log(error);
    }
  }
);

export default instance;
