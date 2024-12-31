import ProductZoom from "../../Components/ProductZoom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../Components/QuantityBox";
import Button from "@mui/material/Button";
import { BsCartFill } from "react-icons/bs";
import { useContext, useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { useParams } from "react-router-dom";


import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../App";
import { FaHeart } from "react-icons/fa";
import RelatedProducts from "./RelateProducts";
import { fetchDataFromApi, postData } from "../../utils/api";

const ProductDetails = () => {
    const [activeTabs, setActiveTabs] = useState(0);
    const { id } = useParams();
    const [activeSize, setActiveSize] = useState(null);
    const [productData, setProductData] = useState([])
    const [relateProductData, setRelateProductData] = useState([])
    let [cartFields, setCartFields] = useState({});
    let [productQuantity, setProductQuantity] = useState();
    const [isAddedToMyList, setSsAddedToMyList] = useState(false);

    const isActive = (index) => {
        setActiveSize(index);
        setTabError(false);
    };
    const [slidesPerView, setSlidesPerView] = useState(1); 

   
    const updateSlidesPerView = () => {
        const width = window.innerWidth;

        if (width >= 1200) {
            setSlidesPerView(5); 
        } else if (width >= 768) {
            setSlidesPerView(4); 
        } else {
            setSlidesPerView(2); 
        }
    };

    useEffect(() => {
        
        updateSlidesPerView();

        
        window.addEventListener('resize', updateSlidesPerView);

     
        return () => {
            window.removeEventListener('resize', updateSlidesPerView);
        };
    }, []);
    useEffect(() => {
        window.scroll(0, 0)
        fetchDataFromApi(`/api/products/${id}`).then((res) => {
            setProductData(res)
         
            fetchDataFromApi(`/api/products/subCatNameRelate?subCat=${res?.subCat}`).then((res) => {
             
                const filteredData = res?.products?.filter(item => item.id !== id)
                setRelateProductData(filteredData)

            })
        })


    }, [id])

    const context = useContext(MyContext)
    const quantity = (val) => {
        setProductQuantity(val);
    };
    const addtoCart = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
     
        cartFields.productTitle = productData?.name;
        cartFields.image = productData?.images[0];
        cartFields.rating = productData?.rating;
        cartFields.price = productData?.price;
        cartFields.quantity = productQuantity;
        cartFields.subTotal = parseInt(productData?.price * productQuantity);
        cartFields.productId = productData?.id;
        cartFields.countInStock = productData?.countInStock;
        cartFields.subCatName = productData?.subCatName;
        cartFields.catName = productData?.catName;

        cartFields.userId = user?.userId;
       

        context.addtoCart(cartFields);

    };

    const addToMyList = (id) => {
        
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user !== undefined && user !== null && user !== "") {
            const data = {
                productTitle: productData?.name,
                image: productData.images[0],
                description:productData.description,
                rating: productData?.rating,
                price: productData?.price,
                productId: productData?.id,
                userId: user?.userId
            }
            postData(`/api/my-list/add/`, data).then((res) => {
                if (res.status !== false) {
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: "the product added in my list"
                    })



                    fetchDataFromApi(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res) => {
                        if (res.length !== 0) {
                            setSsAddedToMyList(true);
                        }
                    })


                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    })
                }

            })
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "Please Login to continue"
            })
        }

    }
    return (
        <>
            <section className="productDetails section">
                <div className="container">

                    <div className="row ">
                        <div className="col-md-5">

                            <ProductZoom images={productData?.images} discount={productData?.discountPercentage} />
                        </div>

                        <div className="col-md-7 pe-5 ps-5 mt-3">
                            <h2 className="hd text-capitalize">{productData?.name}</h2>
                            <ul className="list list-inline">
                                <li className="list-inline-item">
                                    <div className="d-flex align-items-center">
                                        <span className="text-light me-2">AUTHOR : {productData?.author}</span>

                                    </div>
                                </li>
                                <li className="list-inline-item">
                                    <div className="d-flex align-items-center">
                                        <Rating
                                            name="read-only"
                                            value={parseInt(productData?.rating)}
                                            precision={0.5}
                                            readOnly
                                            size="small"
                                        />
                                    </div>
                                </li>


                            </ul>

                            <div className="d-flex info mb-3">
                                <span className="oldPrice">฿{productData?.oldPrice}</span>
                                <span className="netPrice text-danger ms-2">
                                ฿{productData?.price}
                                </span>
                            </div>


                            <span className="badge bg-successs">IN STOCK</span>

                            <p className="mt-3 description">{productData?.description}</p>


                            <div className="row">

                                <div className="col-sm-4">
                                    <QuantityBox
                                        quantity={quantity}
                                        item={productData}

                                    // selectedItem={selectedItem}
                                    />
                                </div>
                            </div>




                            <div className="row mt-3">

                                <div className="col-sm-5 d-flex">
                                    <Button className="btn-blue btn-round btn-big2" onClick={() => addtoCart()}>
                                        {context.addingInCart === true ? "adding..." : " Add to cart"}
                                    </Button>
                                    <Tooltip title="Add to my list" placement="top">
                                        <Button
                                            className={`btn-blue btn-lg btn-circle ms-2`}
                                            onClick={() => addToMyList(productData?.id)}
                                        >
                                            {isAddedToMyList === true ? (
                                                <FaHeart className="text-danger" />
                                            ) : (
                                                <FaRegHeart />
                                            )}
                                        </Button>
                                    </Tooltip>
                                </div>

                                <div className="col-sm-4">


                                </div>
                            </div>



                        </div>
                    </div>


                    <div className="card mt-5 p-5 detailsPageTabs">
                        <div className="customTabs">
                            <ul className="list list-inline">

                                <li className="list-inline-item">
                                    <Button
                                        className={`${activeTabs === 0 && "active"}`}
                                        onClick={() => {
                                            setActiveTabs(0);
                                        }}
                                    >
                                        Additional info
                                    </Button>
                                </li>

                            </ul>

                            <br />


                            {activeTabs === 0 && (
                                <div className="tabContent">
                                    <div className="table-responsive">
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
                                                      
                                                        <Rating value={parseInt(productData?.rating)} size="small" readOnly />
                                                    </td>
                                                </tr>


                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>

                    {
                        relateProductData?.length !== 0 && <RelatedProducts title="RELATED PRODUCTS" data={relateProductData} slidesPerView={slidesPerView} />
                    }





                </div>
            </section>
        </>
    );
};

export default ProductDetails;
