import ForgotPage from "./components/ForgotPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AccountCreated from "./components/AccountCreated";
import { Route, Routes, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import api from "./api/api";
import LoggedOut from "./components/LoggedOut";
import PasswordReset from "./components/PasswordReset";
import Password from "./components/Password";
import Loggedin from "./components/Loggedin";
import AccountConfirm from "./components/AccountConfirm";


function App() {
  const [loggedUser, setLoggedUser] = useState("");
  const [token, setToken] = useState("");
  // let [registerData, setRegisterData] = useState({
  //   username: "",
  //   email: "",
  //   password: "",
  // });
  // let [loginFormData, setLoginFormData] = useState({
  //   username: "",
  //   password: "",
  // });
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setcPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUserJson = localStorage.getItem("loggedInUser");
    if (loggedInUserJson) {
      const user = JSON.parse(loggedInUserJson);
      setLoggedUser(user.username);
      setToken(user.token);
    }
  }, []);
  // handle sign in
  const handleSignIn = async (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password,
    };
    try {
      const response = await api.post("/login", userData);
      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      setLoggedUser(response.data.username);
      setToken(response.data.token);
      setPassword("");
      setEmail("");
      navigate("/user");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const handleURL = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        authorization: `bearer ${token}`,
      },
    };
    const data = {
      longurl: url,
    };
    try {
      await api.post("user/url", data, config);
      setUrl("");
      toast("URL shortened Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setLoggedUser(null);
    setCount(0);
    navigate("/");
    localStorage.clear();
  };

  // handle sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      username,
      password,
    };
    if (password === cPassword) {
      try {
        await api.post("/user/signup", userData);
        setEmail("");
        setUsername("");
        setPassword("");
        setcPassword("");
        navigate("/created");
      } catch (error) {
        toast.error(error.response.data.Err);
      }
    } else {
      toast.error("password mismatch");
    }
  };

  // handle forgot password
  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      await api.put("/user/forgot", { email: email });
      toast.success("Reset link send to your mail");
      setTimeout(() => {
        setEmail("");
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.response.data.Err);
    }
  };

  // handle password reset
  const handleReset = async (e) => {
    e.preventDefault();
    if (password === cPassword) {
      api.patch(`/user/reset/${resetToken}`, { password: password });
      setPassword("");
      setcPassword("");
      navigate("/");
      toast("Password Changed Successfully");
    } else {
      alert("password not matching");
    }
  };

  // handle account confirming
  const handleConfirm = (e) => {
    e.preventDefault();
    try {
      api.patch(`/user/confirm/${resetToken}`);
      navigate("/");
      toast("Account confirmed Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">

        <Routes>
          <Route
            path="/"
            element={
              <SignIn
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                handleSignIn={handleSignIn}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <SignUp
                handleSignUp={handleSignUp}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                username={username}
                setUsername={setUsername}
                cPassword={cPassword}
                setcPassword={setcPassword}
              />
            }
          />
          {loggedUser ? (
            <Route
              path="/user"
              element={
                <Loggedin
                  loggedUser={loggedUser}
                  handleLogout={handleLogout}
                  token={token}
                  url={url}
                  setUrl={setUrl}
                  handleURL={handleURL}
                  count={count}
                  setCount={setCount}
                />
              }
            />
          ) : (
            <Route path="/user" element={<LoggedOut />} />
          )}
          <Route
            path="/forgot"
            element={
              <ForgotPage
                handleForgot={handleForgot}
                email={email}
                setEmail={setEmail}
              />
            }
          />
          <Route path="/created" element={<AccountCreated />} />
          <Route path="/password" element={<Password />} />
          <Route
            path="user/reset/:id"
            element={
              <PasswordReset
                password={password}
                setPassword={setPassword}
                cPassword={cPassword}
                setcPassword={setcPassword}
                handleReset={handleReset}
                setResetToken={setResetToken}
              />
            }
          />
          <Route
            path="/user/confirm/:id"
            element={
              <AccountConfirm
                setResetToken={setResetToken}
                handleConfirm={handleConfirm}
              />
            }
          />
        </Routes>

    </div>
  );
}

export default App;