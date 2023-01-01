import React, { useRef, useState } from "react";
import MetaData from "./Metadata";
import "./Support.css";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../component/Home/Header";
import Breadcrumbs from "./Breadcrumbs";
import Footer from "../Footer";

const Support = ({ history }) => {
  const [done, setDone] = useState(false);

  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        "service_ngdn03l",
        "template_gh9du9c",
        formRef.current,
        "NGj9Y3ce3wYMIvTQf"
      )
      .then(
        (result) => {
          setDone(true);
        },
        (error) => {
          toast.error(error.text)
        }
      );
  };

  return (
    <>
      <MetaData title="Support" />
      <Header />
      <Breadcrumbs />
      <div
        className="support"
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px 0",
        }}
      >
        <h2
          className="support__heading"
          style={{
            textAlign: "center",
          }}
        >
          Hey How can we improve our services
        </h2>
        <h2
          className="support__heading"
          style={{
            textAlign: "center",
          }}
        >
          Report us for something...
        </h2>
        <div>
          <form
            style={{
              width: "400px",
              margin: "auto",
              padding: "20px 0",
            }}
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Write your Name ..."
              required
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                borderBottom: "1px solid var(--main-color)",
                margin: "10px 0",
                fontSize: "16px",
                height: "40px",
              }}
              name="user__name"
            />
            <input
              type="text"
              placeholder="Write a Subject ..."
              required
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                borderBottom: "1px solid var(--main-color)",
                margin: "10px 0",
                fontSize: "16px",
                height: "40px",
              }}
              name="user__subject"
            />
            <input
              type="email"
              placeholder="write your Email ..."
              required
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                borderBottom: "1px solid var(--main-color)",
                margin: "10px 0",
                fontSize: "16px",
                height: "40px",
              }}
            />
            <textarea
              cols="30"
              rows="5"
              required
              placeholder="write your message ..."
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                borderBottom: "1px solid var(--main-color)",
                margin: "10px 0",
                fontSize: "16px",
              }}
              name="user__message"
            ></textarea>
            <button
              style={{
                border: "none",
                cursor: "pointer",
                width: "100%",
                background: "var(--main-color)",
                height: "40px",
                margin: "10px 0",
                color: "#fff",
                fontSize: "16px",
              }}
            >
              Submit
            </button>
            {done &&
              toast.success(
                "Thanks for your report we will reply it in very soon..."
              )}
          </form>
          <div className="animation"></div>
        </div>
      </div>
      <Footer />
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

export default Support;
