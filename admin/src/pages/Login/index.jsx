import { useContext, useEffect, useState } from 'react';


import { MyContext } from '../../App';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../../utils/api';

import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setisShowPassword] = useState(false);
    const context = useContext(MyContext);
    const history = useNavigate();

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);
    }, []);

    const focusInput = (index) => {
        setInputIndex(index);
    }
    const [formfields, setFormfields] = useState({
        email: "",
        password: "",
        isAdmin: true
    })

    const onchangeInput = (e) => {
        setFormfields(() => ({
            ...formfields,
            [e.target.name]: e.target.value
        }))
    }
    const Login = (e) => {
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


                    if (res.user?.isAdmin === true) {

                        const user = {
                            name: res.user?.name,
                            email: res.user?.email,
                            userId: res.user?.id,
                            isAdmin: res.user?.isAdmin
                        }


                        
                        sessionStorage.removeItem('user');
                        sessionStorage.setItem("user", JSON.stringify(user));


                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: "User Login Successfully!"
                        });

                        setTimeout(() => {
                            context.setIsLogin(true);
                            history("/dashboard");
                            setIsLoading(false);
                            // window.location.href = "/dashboard";
                        }, 2000);

                    }

                    else{
                        context.setAlertBox({
                            open: true,
                            error: true,
                            msg: "you are not a admin"
                        });
                        setIsLoading(false);
                    }
                }

                else {
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
            <section className="loginSection">
                <div className="loginBox">
                    <div className='logo text-center'>
                    <div className='logotext align-item-center justify-content-center'>
                    EIGHTH-TWELVE
                    </div>
                       
                    </div>

                    <div className='wrapper mt-3 border'>
                        
                        <form onSubmit={Login}>
                            
                            <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                <span className='icon'><MdEmail /></span>
                                <input type='text' className='form-control' placeholder='enter your email' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name="email" onChange={onchangeInput} />
                            </div>

                            <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                <span className='icon'><RiLockPasswordFill /></span>
                                <input type={`${isShowPassword === true ? 'text' : 'password'}`} className='form-control' placeholder='enter your password'
                                    onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} name="password" onChange={onchangeInput} />

                                <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
                                    {
                                        isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                                    }

                                </span>

                            </div>


                            <div className='form-group'>
                                <Button type='submit' className="btn-blue btn-lg w-100 btn-big">
                                    {
                                        isLoading === true ? <CircularProgress /> : 'Sign In '
                                    }
                                </Button>
                            </div>


                        </form>
                        <span className='text-center txt'>
                            Don't have an account?
                            <Link to={'/signUp'} className='link color ms-2'>Register</Link>
                        </span>
                    </div>

                    

                </div>
            </section>
        </>
    )
}

export default Login;