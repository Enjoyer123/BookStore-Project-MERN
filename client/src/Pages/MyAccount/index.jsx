import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
 
  editData,
  fetchDataFromApi,
 
} from "../../utils/api";

import { MyContext } from "../../App";

import CircularProgress from "@mui/material/CircularProgress";

const MyAccount = () => {
  const [isLogin, setIsLogin] = useState(false);

  const [value, setValue] = React.useState(0);
  const history = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [userData, setUserData] = useState([]);

  const formdata = new FormData();

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    images: [],
    isAdmin: false,
    password: "",
  });

  const [fields, setFields] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const token = sessionStorage.getItem("token");
    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);
    } else {
      history("/signIn");
    }

    const user = JSON.parse(sessionStorage.getItem("user"));

    fetchDataFromApi(`/api/user/${user?.userId}`).then((res) => {
      setUserData(res);

      setFormFields({
        name: res.name,
        email: res.email,
        phone: res.phone,
      });
    });
  }, []);

  const changeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const changeInput2 = (e) => {
  
    setFields(() => ({
      ...fields,
      [e.target.name]: e.target.value,
    }));
  };

  const changePassword = (e) => {
    e.preventDefault();
    formdata.append("password", fields.password);

    if (
      fields.oldPassword !== "" &&
      fields.password !== "" &&
      fields.confirmPassword !== ""
    ) {
      if (fields.password !== fields.confirmPassword) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Password and confirm password not match",
        });
      } else {
        const user = JSON.parse(sessionStorage.getItem("user"));

        const data = {
          name: user?.name,
          email: user?.email,
          password: fields.oldPassword,
          newPass: fields.password,
          phone: formFields.phone,
        };

        editData(`/api/user/changePassword/${user.userId}`, data).then(
          (res) => {
            context.setAlertBox({
              open: true,
              error: false,
              msg: "New password changed",
            });

            history("/")

          }
        );
      }
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all the details",
      });
      return false;
    }
  };

  return (
    <section className="section myAccountPage">
      <div className="container">
        <h2 className="hd">My Account</h2>





        <div className="row">

          <div className="col-md-4 mb-2">
            <div className="form-group">

              <input type="text" value={formFields.name} disabled/>
            </div>
          </div>


          <div className="col-md-4 mb-2">
            <div className="form-group">

              <input type="text" value={formFields.email} disabled/>
            </div>

          </div>

          <div className="col-md-4 mb-2">
            <div className="form-group">

              <input type="text" value={formFields.phone} disabled
              />
            </div>

          </div>

        </div>


        <form onSubmit={changePassword}>
  <div className="row">
    <div className="col-md-4 mb-2">
      <div className="form-group">
        <input
          type="password"
          placeholder="Old password"
          name="oldPassword"
          onChange={changeInput2}
          value={fields.oldPassword}
        />
      </div>
    </div>

    <div className="col-md-4 mb-2">
      <div className="form-group">
        <input
          type="password"
          placeholder="New password"
          name="password"
          onChange={changeInput2}
          value={fields.password}
        />
      </div>
    </div>

    <div className="col-md-4 mb-2">
      <div className="form-group">
        <input
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          onChange={changeInput2}
          value={fields.confirmPassword}
        />
      </div>
    </div>
  </div>

  <div className="form-group mt-2 d-flex justify-content-center">
    <Button
      type="submit"
      className="btn-blue btn-lg btn-big"
    >
      Save
    </Button>
  </div>
</form>



      </div>
    </section>
  );
};

export default MyAccount;
