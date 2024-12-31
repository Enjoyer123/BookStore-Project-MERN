import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom"

import { postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { FaBookReader } from "react-icons/fa";

const SignIn = () => {
  const history = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formfields, setFormfields] = useState({
    email: "",
    password: "",
    isAdmin: true
  })
  const context = useContext(MyContext);
  useEffect(() => {
    context.setisHeaderFooterShow(false);

  }, []);

  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value
    }))
  }

  const login = (e) => {
    e.preventDefault();

    if (formfields.email === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "email can not be blank!"
      })
      return false;
    }



    if (formfields.password === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "password can not be blank!"
      })
      return false;
    }


    setIsLoading(true);
    postData("/api/user/signin", formfields).then((res) => {

      try {

        if (res.error !== true) {

          sessionStorage.setItem("token", res.token);
          const user = {
            name: res.user?.name,
            email: res.user?.email,
            userId: res.user?.id,

          }
          sessionStorage.setItem("user", JSON.stringify(user));


          context.setAlertBox({
            open: true,
            error: false,
            msg: "User Login Successfully!"
          });

          setTimeout(() => {
            context.setisLogin(true);
            history("/");
            setIsLoading(false);
            context.setisHeaderFooterShow(true);
          }, 2000);

        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.msg
          });
          setIsLoading(false);
        }

      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }

    })


  }
  return (

    <>
      <section className="section signInPage">
        <div className="shape-bottom">
          {" "}
          <svg
            fill="#fff"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 1921 819.8"
            style={{ enableBackground: "new 0 0 1921 819.8" }}
          >
            {" "}
            <path
              className="st0"
              d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
            ></path>{" "}
          </svg>
        </div>

        <div className="container">
          <div className="box card p-3 shadow border-0">

            <Link to={'/'}><span className='logotext align-item-center justify-content-center'><FaBookReader />
              EIGHTH-TWELVE</span></Link>


            <form className="mt-3" onSubmit={login}>
              <h2 className="mb-4 singtopic">Sign In</h2>

              <div className="form-group">
                <TextField

                  label="Email"
                  type="email"
                  required
                  variant="standard"
                  className="w-100"
                  name="email"
                  onChange={onchangeInput}
                />
              </div>
              <div className="form-group">
                <TextField
                  label="Password"
                  type="password"
                  required
                  variant="standard"
                  className="w-100"
                  name="password"
                  onChange={onchangeInput}
                />
              </div>

              <a className="border-effect cursor border-effect">Forgot Password?</a>

              <div className="d-flex align-items-center mt-3 mb-3 ">
                <Button type="submit" className="btn-blue col btn-lg btn-big">
                  {isLoading === true ? <CircularProgress /> : "Sign In"}
                </Button>
                <Link to="/">
                  {" "}
                  <Button
                    className="btn-lg btn-big col ms-3 p-4"
                    variant="outlined"
                    onClick={() => context.setisHeaderFooterShow(true)}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <span className="txt">
                  Not Registered?{" "}
                  <Link to="/signUp" className="border-effect">
                    Sign Up
                  </Link>
                </span>

              </div>
            </form>


          </div>
        </div>
      </section>

    </>

  )
}

export default SignIn;