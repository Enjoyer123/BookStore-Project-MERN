import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import Button from '@mui/material/Button';
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import SearchBox from "../SearchBox";
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import { IoShieldHalfSharp } from "react-icons/io5";
import Divider from '@mui/material/Divider';
import { MyContext } from '../../App';

import { useNavigate } from 'react-router-dom'

const Header = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpennotificationDrop, setisOpennotificationDrop] = useState(false);
    const openMyAcc = Boolean(anchorEl);
    const openNotifications = Boolean(isOpennotificationDrop);
    const history = useNavigate();

    const context = useContext(MyContext)

    const handleOpenMyAccDrop = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMyAccDrop = () => {
        setAnchorEl(null);
    };

    const handleOpenotificationsDrop = () => {
        setisOpennotificationDrop(true)
    }

    const handleClosenotificationsDrop = () => {
        setisOpennotificationDrop(false)
    }


    const changeTheme = () => {
        if (context.theme === "dark") {
            context.setTheme("light");
        }
        else {
            context.setTheme("dark");
        }
    }
    const logout = () => {
        sessionStorage.clear()

        setAnchorEl(null)
        context.setAlertBox({
            open: true,
            error: false,
            msg: "Logout success"
        });
        setTimeout(() => {
            history("/login")
        }, 200)
    }
    return (
        <>
            <header className="d-flex align-items-center">
                <div className="container-fluid ">
                    <div className="d-flex align-items-center w-100 justify-content-between">
                        {/* Logo Wraooer */}
                        <div className="col part1 d-flex flex-row">
                            <Link to={'/'} className="d-flex align-items-center logo">
                                <div className='align-item-center justify-content-center'>
                                    <img src="/8_12_Logo.png" alt="" />

                                </div>


                            </Link>


                        </div>





                        <div className="col d-flex align-items-center justify-content-end part3">
                            <Button className="rounded-circle" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
                                {
                                    context.isToggleSidebar === false ? <MdMenuOpen /> : <MdOutlineMenu />
                                }
                            </Button>
                            <Button className="rounded-circle" onClick={changeTheme}>
                                <MdOutlineLightMode />
                            </Button>




                            {
                                context.isLogin !== true ?
                                    <Link to={'/login'}><Button className='btn-blue btn-lg btn-round'>Sign In</Button></Link>
                                    :

                                    <div className="myAccWrapper ms-2">
                                        <Button className="myAcc d-flex align-items-center"
                                            onClick={handleOpenMyAccDrop}
                                        >
                                            <div className="userImg">
                                                <span className="rounded-circle">
                                                    {context.user?.name?.charAt(0)}
                                                </span>
                                            </div>

                                            <div className="userInfo res-hide">
                                                <h4>{context.user?.name}</h4>
                                                <p className="mb-0">{context.user?.email}</p>
                                            </div>

                                        </Button>

                                        <Menu
                                            className='Menu'
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={openMyAcc}
                                            onClose={handleCloseMyAccDrop}
                                            onClick={handleCloseMyAccDrop}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >
                                            <Link to="/my-account" className='linkk'>

                                                <MenuItem onClick={handleCloseMyAccDrop}>

                                                    <ListItemIcon>
                                                        <PersonAdd fontSize="small" />
                                                    </ListItemIcon>
                                                    My Account
                                                </MenuItem>
                                            </Link>


                                            <MenuItem onClick={logout}>
                                                <ListItemIcon>
                                                    <Logout fontSize="small" />
                                                </ListItemIcon>
                                                Logout
                                            </MenuItem>
                                        </Menu>


                                    </div>

                            }





                        </div>

                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;