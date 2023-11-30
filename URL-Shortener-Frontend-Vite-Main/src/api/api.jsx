import axios from "axios";

export default axios.create({
  baseURL: "https://url-shortener-be.onrender.com/",
});

// baseURL: "http://localhost:3001/",