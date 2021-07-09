import axios from "axios";

const http = axios.create({
  baseURL: "http://store-frontend:3000/api/",
});

export default http;
