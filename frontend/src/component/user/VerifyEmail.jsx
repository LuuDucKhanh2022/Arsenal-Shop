import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useState } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import SmsFailedIcon from "@material-ui/icons/SmsFailed";
import "./VerifyEmail.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const VerifyEmail = () => {
  const history = useHistory();
  const params = useParams();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(true);
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await axios.get(
          `/api/v2/confirmation/${params.email}/${params.token}`
        );
        setMessage(data.message);
      } catch (error) {
        let message;
        typeof error.response.data === "string"
          ? (message = error.response.data.slice(
              error.response.data.lastIndexOf("Error") + 6,
              error.response.data.indexOf("<br>")
            ))
          : (message = error.response.data.message);
        setMessage(message);
        setSuccess(false);
      }
    };

    verifyEmail();
  }, [params.email, params.token]);

  const resendLink = () => {
    const resend = async () => {
      try {
        const myForm = new FormData();
        myForm.set("email", params.email);
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        const { data } = await axios.post(
          `/api/v2/confirmation/resendlink`,
          myForm,
          config
        );
        if(data.success === true) {
            toast.success(data.message)
        } else {
            toast.error(data.message)
        }
      } catch (error) {
        let message;
        typeof error.response.data === "string"
          ? (message = error.response.data.slice(
              error.response.data.lastIndexOf("Error") + 6,
              error.response.data.indexOf("<br>")
            ))
          : (message = error.response.data.message);
          toast.error(message)
      }
    };
    resend();
  };
  return (
    <>
      <div className={success ? "verifyEmail" : "verifyEmail fail"}>
        {success ? <CheckCircleIcon /> : <SmsFailedIcon />}
        <Typography>{message}</Typography>
        <div className="verifyEmail__bottom">
          <button onClick={() => history.push({pathname:"/login",state:{from:"verifyEmail"}})}>Login</button>
          <button onClick={resendLink}>Resend</button>
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default VerifyEmail;
