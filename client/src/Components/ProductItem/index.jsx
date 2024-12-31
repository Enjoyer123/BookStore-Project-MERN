import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import Button from '@mui/material/Button';
import { IoMdHeartEmpty } from "react-icons/io";
import { useContext, useState } from "react";
import { MyContext } from "../../App";
import { useEffect } from "react";
import { useRef } from "react";
import Slider from "react-slick";
import Sidebar from "../Sidebar";
import { Link } from 'react-router-dom';
import { IoIosImages } from "react-icons/io";
import { fetchDataFromApi, postData } from '../../utils/api';
import { FaHeart } from "react-icons/fa";

import Skeleton from '@mui/material/Skeleton';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { MdDescription } from 'react-icons/md';



const ProductItem = (props) => {

    const context = useContext(MyContext);
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const sliderRef = useRef();
    const [isAddedToMyList, setSsAddedToMyList] = useState(false);



    const handleMouseEnter = (id) => {
        if (isLoading === false) {
            setIsHovered(true);
            setTimeout(() => {
                if (sliderRef.current) {
                    sliderRef.current.slickPlay();
                }
            }, 20);
        }

    }


    const handleMouseLeave = () => {
        if (isLoading === false) {
            setIsHovered(false);
            setTimeout(() => {
                if (sliderRef.current) {
                    sliderRef.current.slickPause();
                }
            }, 20);
        }
    }

    useEffect(() => {

        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    const addToMyList = (id) => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user !== undefined && user !== null && user !== "") {
            const data = {
                productTitle: props?.item?.name,
                image: props.item?.images[0],
                description: props.item?.description,
                rating: props?.item?.rating,
                price: props?.item?.price,
                productId: id,
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
            <div className={`productItem ${props.itemView}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="img_rapper">
                    <Link to={`/product/${props?.item?.id}`}>



                        {
                            isHovered ? (
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    navigation
                                    spaceBetween={1}
                                    slidesPerView={1}
                                    pagination={{ clickable: true }}
                                    autoplay={{ delay: 2000 }}
                                    loop={true}
                                    className='productItemSlider'
                                >
                                    {
                                        props.item?.images?.map((image, index) => (
                                            <SwiperSlide key={index}>
                                                <img src={image} className="" alt={`Slide ${index}`} />
                                            </SwiperSlide>
                                        ))
                                    }
                                </Swiper>
                            ) : (
                                <img src={props.item?.images[0]} className="" alt="Product" />
                            )
                        }






                    </Link>
                    <span className="badge">{props.item?.discountPercentage}%</span>

                    <div className="actions">
                       

                        <Button className={isAddedToMyList ? 'active' : ''} onClick={() => addToMyList(props.item?.id)}>
                            {
                                isAddedToMyList ? <FaHeart style={{ fontSize: '20px' }} />
                                    :
                                    <IoMdHeartEmpty style={{ fontSize: '20px' }} />
                            }
                        </Button>

                    </div>
                </div>
                <div className="info mt-3">
                    <div className="info-name">
                        <h4>
                            {props?.item?.name.length > 27
                                ? props.item.name.substr(0, 10) + '...'
                                : props.item.name}
                        </h4>
                        {/* <h4>{props?.item?.name.substr(0, 27) + '...'}</h4> */}
                    </div>
                    <span className="text-success d-block badge1">In Stock</span>
                    <Rating className="mt-2 mb-2" name="read-only" value={props?.item?.rating} size="small" precision={0.5} readOnly />
                    <div className="d-flex">
                        <span className="oldPrice">฿{props?.item?.oldPrice}</span>
                        <span className="netPrice text-danger ms-2">฿{props?.item?.price}</span>



                    </div>
                </div>
            </div >


        </>
    )


}


export default ProductItem;