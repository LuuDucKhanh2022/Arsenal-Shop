import React from "react";
import { Link, useLocation } from "react-router-dom";

const Notfound = () => {
  let location = useLocation();
  return (
    <>
      {location.pathname === "/process/payment" ? (
        <></>
      ) : (
        <div>
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <h1>404 Not Found anything in this url</h1>
            <Link
              to="/"
              style={{
                color: "var(--main-color)",
                fontSize: "16px",
                fontFamily: "sans-serif",
                padding: "1vmax 0",
              }}
            >
              Go Back to Home
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Notfound;
