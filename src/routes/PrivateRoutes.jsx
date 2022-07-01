import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Route, Redirect } from "react-router-dom";
import { errorAlert } from "../utils/alert";
import { decrypt } from "../utils/crypto";

function PrivateRoutes({ Component, ...rest }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);


  if (token == null) {
    return <Redirect to="/login" />;
  }

  return <Route {...rest} render={() => <Component {...rest} />} />;
}

export default PrivateRoutes;
