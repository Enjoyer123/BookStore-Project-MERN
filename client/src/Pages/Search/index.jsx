
import Button from '@mui/material/Button';
import { IoIosMenu } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import ProductItem from "../../Components/ProductItem";
import Pagination from '@mui/material/Pagination';
import { TbGridDots } from "react-icons/tb";
import { MyContext } from "../../App";

const SearchPage = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [productView, setProductView] = useState('three');
    const [productData, setProductData] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const openDropdown = Boolean(anchorEl);
    const [isOpenFilter, setIsOpenFilter] = useState(false);

    const context = useContext(MyContext);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    useEffect(() => {
        window.scrollTo(0, 0);

        setTimeout(() => {
            setProductData(context?.searchData?.products || []);  
        }, 10);
    }, [context.searchData]);


   
    return (
        <>
            <section className="product_Listing_Page">
                <div className="container">
                    <div className="productListting">
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
                            </div>

                            <div className="productListing">

                                {productData.length > 0 ? (
                                    productData.map((item, index) => (
                                        <ProductItem key={index} itemView={productView} item={item} />
                                    ))
                                ) : (
                                    <p>No products found</p>
                                )}

                            </div>



                        </div>

                    </div>
                </div>

            </section>

        </>
    )
}

export default SearchPage;