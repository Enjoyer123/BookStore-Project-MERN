import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";

import Cookies from 'js-cookie';
import { FaBookReader } from "react-icons/fa";

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
import { FaAngleRight } from "react-icons/fa6";

import { MdClose } from "react-icons/md";

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
            history("/");
        }
    }, []);


    const logout = () => {
        sessionStorage.clear();

        context.setAlertBox({
            open: true,
            error: false,
            msg: "Logout successfull"
        })

       

    }
    

    return (
        <>
            

            <div className='sidebar'>
                <div className="logoWrapper d-flex justify-content-between mb-5">
                <Link to={'/'}><span className='logotext align-item-center justify-content-center'><FaBookReader />
                EIGHTH-TWELVE2</span></Link>                   
                 <Button className="close_" onClick={context.toggleSidebar}>
                        <MdClose />
                    </Button>
                </div>

                {context.categoryData.length !== 0 && context.categoryData.map((item, index) => (
                    <li key={index}>
                        <div className='d-flex justify-content-between flex-row'>
                            <Link
                                to={`/products/category/${item.id}`} 
                                onClick={() => {
                                    Cookies.set('categoryId', item.id); 
                                }}
                            >
                                {item.name}
                            </Link>

                            <div className='arrow'><FaAngleRight /></div>
                        </div>
                        {/* แสดง subCat เมื่อ hover */}
                        <ul className='submenu'>
                            {context.subCategoryData
                                .filter(subCatItem => subCatItem.category.name === item.name) 
                                .map((filteredSubCatItem, subIndex) => (
                                    <li key={subIndex}>
                                        <Link
                                            to={`/products/subCat/${filteredSubCatItem.id}`} 
                                            onClick={() => {
                                                Cookies.set('categoryId', item.id); 
                                            }}
                                        >
                                            <Button>{filteredSubCatItem.subCat}</Button>
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </li>
                ))}
            </div>


        </>
    )
}

export default Sidebar;

