import Button from '@mui/material/Button';
import { IoIosMenu } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { CiHome } from "react-icons/ci";
import { useContext, useState } from 'react';
import { FaAngleRight } from "react-icons/fa6";
import { MyContext } from '../../../App';
import { useEffect } from 'react';
import Cookies from 'js-cookie';



const Navigations = (props) => {
    const [isOpenSidebarNav, setIsOpenSidebarNav] = useState(false);

    const context = useContext(MyContext)
    const getSubCategories = (categoryId) => {
        return navData.filter(item => item.category._id === categoryId);
    };
   
    return (
        <>
            <nav>
                <div className='container'>
                    <div className='row'>

                        <div className='col navPart2 d-flex align-items-center'>
                            <ul className=''>
                                {props?.navCatData?.length !== 0 && props?.navCatData?.map((item, index) => (
                                    <li className='list-inline-item position-relative ms-4' key={index}>
                                        <Link
                                            to={`/products/category/${item.id}`}
                                            onClick={() => {
                                                Cookies.set('categoryId', item.id); 
                                            }}
                                        >
                                            {item.name}
                                        </Link>

                                       
                                        <ul className='submenu'>
                                            {props?.navData
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
                            </ul>
                        </div>

                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navigations;