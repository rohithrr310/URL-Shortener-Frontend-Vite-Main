import React, { useContext, useEffect, useState } from "react";
import api from "../api/api";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiLogOut } from "react-icons/fi";
import { FaReact, FaLink, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";

const Loggedin = ({
  loggedUser,
  handleLogout,
  token,
  url,
  setUrl,
  handleURL,
  count,
  setCount,
}) => {
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const [shortenUrl, setShortenUrl] = useState();
  let allShortenUrl, length;
  const config = {
    headers: { authorization: `bearer ${token}` },
  };
  useEffect(() => {
    fetchedData();
  },[handleURL]);
  const fetchedData = async () => {
    try {
      allShortenUrl = await api.get("user/url", config);
      if (allShortenUrl) {
        length = allShortenUrl.data.length;
        setCount(length);
        setShortenUrl(allShortenUrl.data);
      }
    } catch (error) {
      if (error.response.data) {
        toast.error(error.response.data.error);
        navigate("/");
      }
    }
  };

  return (
    <div className="login">
      <nav className="navbar navbar-light bg-light px-2 d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
        <h1 className=" fw-bolder d-flex gap-1 align-items-baseline">
          <FaReact /> URL Shortner
        </h1>
        <form
          onSubmit={handleURL}
          className="d-flex justify-content-center gap-4"
        >
          <input
            type="url"
            className="px-2 rounded"
            placeholder="Enter URL"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary  d-flex gap-1 align-items-center"
          >
            <FaLink /> Create
          </button>
        </form>
        <button
          onClick={handleLogout}
          className="btn customBtn btn-outline-secondary d-flex align-items-center gap-2"
        >
          {width > 500 ? "logout" : ""}
          <FiLogOut />
        </button>
      </nav>
      <header className="bg-dark py-1">
        <p className="lead fw-normal text-center text-white-50 mb-0">
          Welcome back {loggedUser} !!!
        </p>
      </header>
      <main>
        <h3 className="pt-2 text-center">Total URL Created - {count}</h3>
        <ul className="customUl">
          {shortenUrl &&
            shortenUrl.map((e) => {
              return (
                <li key={e._id} className="customList">
                  <a
                    href={e.shorturl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className=" d-flex align-items-center gap-2"
                  >
                    <button className="btn btn-success">
                      Short URL : {e.shorturl}
                    </button>{" "}
                    {width > 500 ? <FaExternalLinkAlt /> : ""}
                  </a>
                  <a
                    href={e.longurl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className=" d-flex align-items-center gap-2"
                  >
                    <button className="btn btn-warning">
                      long URL : {e.longurl}
                    </button>
                    {width > 500 ? <FaExternalLinkAlt /> : ""}
                  </a>
                </li>
              );
            })}
        </ul>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        transition={Zoom}
        draggable={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Loggedin;