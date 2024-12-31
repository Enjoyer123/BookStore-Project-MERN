import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa6";
import { MdMessage } from "react-icons/md";
import { FaBell } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { Link, NavLink } from 'react-router-dom';
import { useContext, useState } from 'react';
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from '../../App';
import { FaClipboardCheck } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BiSolidCategory } from "react-icons/bi";
import { TbSlideshow } from "react-icons/tb";

import { RiDiscountPercentLine } from "react-icons/ri";

const Sidebar = () => {

    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    const context = useContext(MyContext);

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu)
    }
    const history = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
        }
        else {
            history("/login");
        }
    }, []);


    const logout = () => {
        sessionStorage.clear();
      
        context.setAlertBox({
            open: true,
            error: false,
            msg: "Logout successfull"
        })

        setTimeout(() => {
            history("/login");
        }, 2000);

    }

    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/">
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                <span className='icon'><MdDashboard /></span>
                                Dashboard
                             
                            </Button>
                        </NavLink>
                    </li>

                  

                    <li>
                        <Button className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                            <span className='icon'><TbSlideshow /></span>
                            Home Banner Slides
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/homeBannerSlide/add">Add Home Banner Slide</NavLink></li>
                                <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/homeBannerSlide/list">Home Slides List</NavLink></li>

                            </ul>
                        </div>
                    </li>

                    <li>
                    <Button className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                        <span className='icon'><BiSolidCategory /></span>
                        Category
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                    <div className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                        <ul className='submenu'>
                            <li><Link to="/category">Category List</Link></li>
                            <li><Link to="/category/add">Add a category</Link></li>
                            <li><Link to="/subCategory">Sub Category List</Link></li>
                            <li><Link to="/subCategory/add">Add a sub category</Link></li>
                        </ul>
                    </div>
                </li>


                    <li>
                        <Button className={`w-100 ${activeTab === 3 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                            <span className='icon'><FaProductHunt /></span>
                            Products
                            <span className='arrow'><FaAngleRight /></span>
                        </Button>
                        <div className={`submenuWrapper ${activeTab === 3 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/products">Product List</NavLink></li>
                               
                                <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/product/upload">Product Upload</NavLink></li>
                                
                            </ul>
                        </div>
                    </li>

                  

                    <li>
                            <Button className={`w-100 ${activeTab === 4 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                                <span className='icon'> <FaClipboardCheck fontSize="small" /></span>
                                Orders<span className='arrow'><FaAngleRight /></span>
                            </Button>
                            <div className={`submenuWrapper ${activeTab === 4 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                            <ul className='submenu'>
                                <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/orders">Order Pending</NavLink></li>
                               
                                <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/orders/complete">Order Complete</NavLink></li>
                                
                            </ul>
                        </div>
                        
                    </li>


                    <li>
                    <Button className={`w-100 ${activeTab === 5 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                        <span className='icon'><TbSlideshow /></span>
                        Home Banners
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                    <div className={`submenuWrapper ${activeTab === 5 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                        <ul className='submenu'>
                            <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/banners">Banners List</NavLink></li>
                           
                            <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/banners/add">Banner Upload</NavLink></li>
                           
                        </ul>
                    </div>
                </li>

                <li>
                    <Button className={`w-100 ${activeTab === 6 && isToggleSubmenu === true ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
                        <span className='icon'><RiDiscountPercentLine />
                        </span>
                        Discount
                        <span className='arrow'><FaAngleRight /></span>
                    </Button>
                    <div className={`submenuWrapper ${activeTab === 6 && isToggleSubmenu === true ? 'colapse' : 'colapsed'}`}>
                        <ul className='submenu'>
                            
                            <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/discount/add">Add mount Discount</NavLink></li>
                            <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/subdiscount/add">Add subcat Discount</NavLink></li>
                            <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/promotionOg/add">Add promotionOg</NavLink></li>
                            <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/discount">mountDiscountList</NavLink></li>

                            <li><NavLink className={({ isActive }) => (isActive ? 'is-active' : '')} to="/subdiscount">Sub-OgDiscountList</NavLink></li>

                        </ul>
                    </div>
                </li>

                
                </ul>


                <br />

                <div className='logoutWrapper'>
                    <div className='logoutBox'>
                        <Button variant="contained" onClick={logout}><IoMdLogOut /> Logout</Button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Sidebar;