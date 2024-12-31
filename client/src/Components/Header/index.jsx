import { Link, useNavigate } from 'react-router-dom';


import React, { useEffect, useRef, useState } from 'react';
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import Button from '@mui/material/Button';
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import SearchBox from './SearchBox';
import Navigations from './Navigations';
import { MyContext } from '../../App';
import { useContext, usest } from 'react';
import { MdOutlineLightMode } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";

import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FaClipboardCheck } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa6";
const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpenNav, setIsOpenNav] = useState(false);
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const open = Boolean(anchorEl);

    const headerRef = useRef();
    const context = useContext(MyContext);

    const history = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };


   

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeTheme=()=>{
        if(context.theme==="dark"){
         context.setTheme("light");
        }
        else{
         context.setTheme("dark");
        }
     }
    const logout = () => {
        setAnchorEl(null);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        // localStorage.removeItem("location");
        context.setisLogin(false);
        // window.location.href = "/signIn"
        history("/signIn");
    }


    const openNav = () => {
        setIsOpenNav(!isOpenNav);
        context.setIsOpenNav(true)
    }

    const closeNav = () => {
        setIsOpenNav(false);
        context.setIsOpenNav(false)
    }

    const openSearch = () => {
        setIsOpenSearch(!isOpenSearch);
    }

    const closeSearch = () => {
        setIsOpenSearch(false);
    }
    return (
        <>
            <header className="headerWrapper sticky">
              

                <div className="header">
                    <div className="container">
                        <div className="row mb-3">
                            <div className="logoWrapper d-flex align-items-center col-sm-5 col-md-7">
                                <Link to={'/'}><div className='logotext'><FaBookReader />
                                EIGHTH-TWELVE</div></Link>
                            </div>
                            <div className='col-sm-7 col-md-5 d-flex align-items-center justify-content-end part2'>

                                
                                <div className='part3 d-flex align-items-center '>
                                <Button className="rounded-circle navbtn" onClick={context.toggleSidebar}>
                                {
                                    context.isToggleSidebar === false ? <MdMenuOpen /> : <MdOutlineMenu />
                                }
                                
                            </Button>
                            <Button className="rounded-circle" onClick={changeTheme}>
                                <MdOutlineLightMode />
                            </Button>
                                    {
                                        context.isLogin !== true && <Link to="/signIn">
                                            <Button className="ms-2 me-2 btn-blue btn-round">Sign In</Button>
                                        </Link>

                                    }
                                    {
                                        context.isLogin === true &&
                                        <>
                                            <Button className='circle ms-2' onClick={handleClick}><FiUser /></Button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                id="accDrop"
                                                open={open}
                                                onClose={handleClose}
                                                onClick={handleClose}

                                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                            >
                                                <Link to="/my-account">
                                                    <MenuItem onClick={handleClose}>
                                                        <ListItemIcon>
                                                            <FaUserAlt fontSize="small" />
                                                        </ListItemIcon>
                                                        My Account
                                                    </MenuItem>
                                                </Link>
                                                <Link to="/orders">
                                                    <MenuItem onClick={handleClose}>
                                                        <ListItemIcon>
                                                            <FaClipboardCheck fontSize="small" />
                                                        </ListItemIcon>
                                                        Orders
                                                    </MenuItem>
                                                </Link>
                                                <Link to="/my-list">
                                                    <MenuItem onClick={handleClose}>
                                                        
                                                            <ListItemIcon>
                                                                <FaHeart fontSize="small" />
                                                            </ListItemIcon>
                                                            My List
                                                       
                                                    </MenuItem>
                                                </Link>
                                                <MenuItem onClick={logout}>
                                                    <ListItemIcon>
                                                        <RiLogoutCircleRFill fontSize="small" />
                                                    </ListItemIcon>
                                                    Logout
                                                </MenuItem>
                                            </Menu>
                                        </>

                                    }
                                    <div className='cartTab d-flex align-items-center'>
                                      
                                        <div className='position-relative ms-2'>
                                            <Link to='/cart'>
                                                <Button className='circle ms-2'><IoBagOutline />
                                                </Button>
                                            </Link>
                                            <span className='count d-flex align-items-center justify-content-center'>{context.cartData?.length > 0 ? context.cartData?.length : 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`headerSearchWrapper ${isOpenSearch === true && 'open'}`}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <span className="closeSearch" onClick={() => setIsOpenSearch(false)}></span>
                                        <SearchBox closeSearch={closeSearch} />
                                    </div>
                                </div>

                    </div>
                </div>

                {
                    context.subCategoryData?.length !== 0 && <Navigations navCatData={context.categoryData} navData={context.subCategoryData} />
                }


            </header>
        </>
    )
}

export default Header;