import React, { useContext } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ProductItem from "../../../Components/ProductItem";
import Button from '@mui/material/Button';
import { IoIosArrowRoundForward } from "react-icons/io";
import { MyContext } from "../../../App";

const RelatedProducts = (props) => {

    const context = useContext(MyContext);

    return (
        <>
            <div className="d-flex align-items-center mt-4">
                <div className="info w-100">
                    <h3 className="mb-0 hd">{props.title}</h3>
                    
                </div>
            </div>

            <div className="product_row w-100 mt-3">

                <Swiper
                    slidesPerView={props.slidesPerView}
                    spaceBetween={3}
                    navigation={true}
                    modules={[Navigation]}
                    slidesPerGroup={1}
                    className="mySwiper"


                >
                     {
                        props?.data?.length !== 0 && props?.data?.map((item, index) => {
                            return (
                                <SwiperSlide key={index} >
                                    <ProductItem item={item} />
                                </SwiperSlide>
                            )
                        })
                    }


                </Swiper>
            </div>
       
        </>
    )
}

export default RelatedProducts;