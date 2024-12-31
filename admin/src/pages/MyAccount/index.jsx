import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {

  editData,
  fetchDataFromApi,

} from "../../utils/api";

import CircularProgress from '@mui/material/CircularProgress';

import Chip from '@mui/material/Chip';
import { emphasize, styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { MyContext } from "../../App";
import Breadcrumbs from '@mui/material/Breadcrumbs';



//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const MyAccount = () => {
  const [isLogin, setIsLogin] = useState(false);

  const [value, setValue] = React.useState(0);
  const history = useNavigate();
  const [isLoading2, setIsLoading2] = useState(false)

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
    <section className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-3 align-items-center">
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
          <StyledBreadcrumb
            component="a"
            href="#"
            label="My Account"
          />

        </Breadcrumbs>
      </div>
      <div className="container">



        <form className='form'>
          <div className='row'>
            <div className='col card-big'>
              <div className='card p-4'>

                <div className='form-group'>
                  <input type="text" value={formFields.name} disabled />
                </div>

                <div className='form-group'>
                  <input type="text" value={formFields.name} disabled />
                </div>


                <div className='form-group'>
                  <input type="text" value={formFields.phone} disabled />
                </div>




              </div>

            </div>
          </div>
        </form>
        <form className='form' onSubmit={changePassword}>
          <div className='row'>
            <div className='col card-big'>
              <div className='card p-4'>

                <div className='form-group'>
                  <input
                    type="password"
                    placeholder="Old password"
                    name="oldPassword"
                    onChange={changeInput2}
                    value={fields.oldPassword}
                  />
                </div>

                <div className='form-group'>
                  <input
                    type="password"
                    placeholder="New password"
                    name="password"
                    onChange={changeInput2}
                    value={fields.password}
                  />
                </div>


                <div className='form-group'>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    onChange={changeInput2}
                    value={fields.confirmPassword}
                  />



                </div>

                <Button type="submit" disabled={uploading === true ? true : false} className="btn-blue btn-lg btn-big w-100"
                >{isLoading2 === true ? <CircularProgress color="inherit" className="loader" /> : 'Change Password'}  </Button>
              </div>
            </div>

          </div>
        </form>


      </div>
    </section>
  );
};

export default MyAccount;
