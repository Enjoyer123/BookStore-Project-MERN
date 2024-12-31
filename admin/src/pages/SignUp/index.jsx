import { useContext, useEffect, useState } from 'react';


import { MyContext } from '../../App';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { postData } from '../../utils/api';

import { IoMdHome } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { FaBookReader } from "react-icons/fa";


const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setisShowPassword] = useState(false);
  const [isShowConfirmPassword, setisShowConfirmPassword] = useState(false);

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
  }, []);

  const focusInput = (index) => {
    setInputIndex(index);
  }

  const [formfields, setFormfields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: true
  });
  const onchangeInput = (e) => {
    setFormfields(() => ({
      ...formfields,
      [e.target.name]: e.target.value
    }))
  }
 
  const signUp = (e) => {
    e.preventDefault();
    const namePattern = /^[a-zA-Z\s]+$/; 
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const phonePattern = /^\d{10}$/; 
    
    try {
      if (formfields.name === "" || !namePattern.test(formfields.name)) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Name can not be blank and should only contain letters and spaces!",
        });
        return false;
      }

      if (formfields.email === "" || !emailPattern.test(formfields.email)) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Invalid email format!",
        });
        return false;
      }

      if (formfields.phone === "" || !phonePattern.test(formfields.phone)) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Phone number should be 10 digits!",
        });
        return false;
      }

      if (formfields.password !== formfields.confirmPassword) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Passwords do not match!",
        });
        return false;
      }

      setIsLoading(true);
      postData("/api/user/signup", formfields)
        .then((res) => {
          if (res.error !== true) {
            context.setAlertBox({
              open: true,
              error: false,
              msg: "Register Successfully!",
            });

            setTimeout(() => {
              setIsLoading(false);
              history("/login");
            }, 2000);
          } else {
            setIsLoading(false);
            context.setAlertBox({
              open: true,
              error: true,
              msg: res.msg,
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error posting data:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="loginSection ">

        <div className='signUpSection row d-flex justify-content-center align-item-center p-5'>


          <div className='col-md-4 pr-0'>
            <div className="loginBox">
              <div className='logo text-center'>
              <div className='logotext align-item-center justify-content-center'>
              EIGHTH-TWELVE
              </div>
                <h5 className='font-weight-bold'>Register a new account</h5>
              </div>

              <div className='wrapper card border'>
                <form onSubmit={signUp}>

                  <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                    <span className='icon'><FaUserCircle /></span>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Enter your name (letters and spaces only)'
                      onFocus={() => focusInput(0)}
                      onBlur={() => setInputIndex(null)}
                      autoFocus
                      name="name"
                      onChange={onchangeInput}
                    />                                </div>


                  <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                    <span className='icon'><MdEmail /></span>
                    <input
                      type='text'
                      className='form-control'
                      placeholder='Enter your email (e.g., example@domain.com)'
                      onFocus={() => focusInput(1)}
                      onBlur={() => setInputIndex(null)}
                      name="email"
                      onChange={onchangeInput}
                    />                                </div>


                  <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                    <span className='icon'><FaPhoneAlt /></span>
                    <input
                      type='number'
                      className='form-control'
                      placeholder='Enter your phone number (10 digits)'
                      onFocus={() => focusInput(2)}
                      onBlur={() => setInputIndex(null)}
                      name="phone"
                      onChange={onchangeInput}
                    />                                </div>


                  <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
                    <span className='icon'><RiLockPasswordFill /></span>

                    <input
                      type={`${isShowPassword === true ? 'text' : 'password'}`}
                      className='form-control'
                      placeholder='Enter your password'
                      onFocus={() => focusInput(3)}
                      onBlur={() => setInputIndex(null)}
                      name="password"
                      onChange={onchangeInput}
                    />
                    <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
                      {
                        isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                      }

                    </span>

                  </div>



                  <div className={`form-group position-relative ${inputIndex === 4 && 'focus'}`}>
                    <span className='icon'><IoShieldCheckmarkSharp /></span>
                    <input
                      type={`${isShowConfirmPassword === true ? 'text' : 'password'}`}
                      className='form-control'
                      placeholder='Confirm your password'
                      onFocus={() => focusInput(4)}
                      onBlur={() => setInputIndex(null)}
                      name="confirmPassword"
                      onChange={onchangeInput}
                    />
                    <span className='toggleShowPassword' onClick={() => setisShowConfirmPassword(!isShowConfirmPassword)}>
                      {
                        isShowConfirmPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                      }

                    </span>

                  </div>


                  <div className='form-group'>
                    <Button type='submit' className="btn-blue btn-lg w-100 btn-big">
                      {
                        isLoading === true ? <CircularProgress /> : 'Sign Up '
                      }
                    </Button>
                  </div>

                

                </form>

                <span className='text-center d-block'>
                  Don't have an account?
                  <Link to={'/login'} className='link color ms-2'>Sign In</Link>
                </span>

              </div>



            </div>
          </div>
        </div>


      </section>
    </>
  )

}

export default SignUp;