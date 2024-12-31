
import React, { useEffect, useRef } from "react";
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';

import { MdBrandingWatermark } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";

import Rating from '@mui/material/Rating';
import { FaReply } from "react-icons/fa";
import { MdFilterVintage } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { IoIosPricetags } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import ProductZoom from '../../components/ProductZoom';

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});



const ProductDetails = () => {

    const [productData, setProductData] = useState([]);
    const [reviewsData, setreviewsData] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi(`/api/products/${id}`).then((res) => {
            setProductData(res);
        })


    }, [id]);



    return (
        <>
            <div className="right-content w-100 productDetails ">
                <div className="card shadow border-0 w-100 flex-row p-3 align-items-center">

                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"

                        />

                        <StyledBreadcrumb
                            label="Products"
                            component="a"
                            href="#"
                        />
                        <StyledBreadcrumb
                            label="Product View"

                        />
                    </Breadcrumbs>
                </div>



                <div className='card productDetailsSEction'>
                    <div className='row'>
                        <div className='col-sm-12 col-md-12 col-xl-4'>
                            <div className="sliderWrapper pt-3 ps-4">
                                <h6 className="">Product Gallery</h6>
                                <ProductZoom images={productData?.images} discount={productData?.discountPercentage} />
                            </div>
                        </div>
                        <div className='col-sm-12 col-md-12 col-xl-7'>
                            <div className="p-4">
                                <h4 className="mt-4">{productData?.name}</h4>
                                <p className="mt-4">{productData?.description}</p>
                            </div>

                        </div>
                    </div>


                  

                </div>

                <div className="productInfo">
                    <table className="table table-striped table-bordered">
                        <tbody className="tabledetail">
                            <tr>
                                <th>Author</th>
                                <td>
                                    <p>{productData?.author}</p>
                                </td>
                            </tr>
                            <tr>
                                <th>Category</th>
                                <td>
                                    <p>{productData?.catName}</p>
                                </td>
                            </tr>
                            <tr>
                                <th>Sub Category</th>
                                <td>
                                    <p>{productData?.subCatName}</p>
                                </td>
                            </tr>
                            <tr>
                                <th>Publish</th>
                                <td>
                                    {/* <p>{productData?.dateCreated}</p> */}
                                    <p>{new Date(productData?.dateCreated).toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    timeZone: "Asia/Bangkok"
                })}</p>
                                </td>
                            </tr>
                            <tr>
                                <th>Rating</th>
                                <td>
                                    <p><Rating name="read-only" value={Number(productData?.rating)} precision={0.5} size="small" readOnly /></p>
                                </td>
                            </tr>


                        </tbody>
                    </table>
                </div>



            </div>






        </>
    )
}

export default ProductDetails;