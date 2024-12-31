
import Button from '@mui/material/Button';
import { IoSettingsOutline } from "react-icons/io5";
import Sidebar from "../../Components/Sidebar";
import { IoIosMenu } from "react-icons/io";
import { TbGridDots } from "react-icons/tb";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from 'react';
import React from 'react';
import ProductItem from "../../Components/ProductItem"
import Cookies from 'js-cookie';
import Pagination from '@mui/material/Pagination';
import { useParams, useLocation } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';
import { useContext } from 'react';
import { MyContext } from '../../App';

const Listing = () => {
    const [loading, setLoading] = useState(true); 

    const [productView, setProductView] = useState('three')
    const context = useContext(MyContext);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
    const [productData, setProductData] = useState([])
    const [productData1, setProductData1] = useState([])
    const [anchorEl, setAnchorEl] = useState(null);
    const openDropdown = Boolean(anchorEl);
    const { subCatId } = useParams();
    const categoryId = Cookies.get('categoryId');

   

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        let url = window.location.href;
        let apiEndPoint = "";
        if (url.includes("subCat")) {
            apiEndPoint = `/api/products/subCatName?subCat=${subCatId}&category=${categoryId}`;
        }
        if (url.includes("category")) {
            apiEndPoint = `/api/products/CatName?category=${categoryId}`;
        }

        fetchDataFromApi(`${apiEndPoint}`)
            .then((res) => {

                if (res.products && res.products.length > 0) {
                    setProductData(res);
                   
               
                } else {
                  
                    setProductData([]); 

                    // history("/")
                }
            }).finally(() =>{
                setLoading(false)
            })
            
    }, [subCatId, categoryId]);

    const handleChange = (event, value) => {
        let url = window.location.href;
        let apiEndPoint = "";
        if (url.includes("subCat")) {
            apiEndPoint = `/api/products/subCatName?page=${value}&subCat=${subCatId}&category=${categoryId}`;
        }
        if (url.includes("category")) {
            apiEndPoint = `/api/products/CatName?page=${value}&category=${categoryId}`;
        }

        context.setProgress(40)
        fetchDataFromApi(`${apiEndPoint}`).then((res) => {
            setProductData(res);
            

            context.setProgress(100)
        })
    }
   


    const filterByPrice = (price) => {
        var window_url = window.location.href;


        var api_EndPoint = "";

        if (window_url.includes("subCat")) {
            api_EndPoint = `/api/products/fiterByPrice?minPrice=${price[0]
                }&maxPrice=${price[1]}&subCat=${subCatId}`;
        }
        if (window_url.includes("category")) {
            api_EndPoint = `/api/products/fiterByPrice?minPrice=${price[0]
                }&maxPrice=${price[1]}&category=${categoryId}`;
        }

        fetchDataFromApi(`${api_EndPoint}`).then((res) => {
            setProductData(res);

            // console.log("price",res)
            
            



        });
    };

    const filterByRating = (rating) => {


        let url = window.location.href;
        let apiEndPoint = "";

        if (url.includes("subCat")) {
            apiEndPoint = `/api/products/rating?rating=${rating}&subCat=${subCatId}`;
        }
        if (url.includes("category")) {
            apiEndPoint = `/api/products/rating?rating=${rating}&category=${categoryId}`;
        }

        fetchDataFromApi(apiEndPoint).then((res) => {
            setProductData(res);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });
    };


    return (
        <>
        {/* {console.log("p",productData)} */}
            <section className="product_Listing_Page">
                <div className="container">
                    <div className="productListting">


                        <div className="sticky2">
                            <div className='setting'>

                                <Button className="btn-blue2" onClick={() => context.setisToggleSidebarSetting(!context.isToggleSidebarSetting)}>
                                    {
                                        <IoSettingsOutline />
                                    }
                                </Button>
                            </div>
                        </div>

                        <div className={`sidebarWrapper ${context.isToggleSidebarSetting === true ? "toggle" : ""}`}>


                            <Sidebar filterByPrice={filterByPrice} filterByRating={filterByRating} />

                        </div>

                        <div className="content_right">

                            <div className="showBy mt-3 mb-3 d-flex align-items-center">
                                <div className='d-flex align-items-center btnWrapper'>
                                    <Button className={productView === 'one' ? 'act' : ''} onClick={() => setProductView('one')}>
                                        <IoIosMenu />
                                    </Button>
                                    <Button className={productView === 'three' ? 'act' : ''} onClick={() => setProductView('three')}>
                                        <TbGridDots />
                                    </Button>

                                </div>


                                <div className='ms-auto showByFillter'>

                                    <Menu
                                        className='w-100 showPerPageDropdown'
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={openDropdown}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>9</MenuItem>
                                        <MenuItem onClick={handleClose}>18</MenuItem>
                                        <MenuItem onClick={handleClose}>3</MenuItem>
                                    </Menu>
                                </div>
                            </div>

                            <div className="productListing">

                                {loading ? (
                                    <p>Loding product....</p>
                                
                                 ): productData.totalPages > 0 ? (
                                    productData?.products?.map((item, index) => (
                                        <ProductItem key={index} itemView={productView} item={item} />
                                    ))
                                ) : (
                                    <p>No products found</p>
                                )}


                            </div>


                            {productData?.totalPages > 1 &&
                                <div className="d-flex align-items-center justify-content-center tableFooter mt-4">
                                    <Pagination count={productData?.totalPages} className="pagination" color="secondary"
                                        onChange={handleChange} />
                                </div>
                            }

                        </div>

                    </div>
                </div>




            </section>


        </>
    )

}


export default Listing;