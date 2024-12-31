import React, { useContext } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay,Pagination } from 'swiper/modules';
import { MyContext } from "../../App";

import 'swiper/css';
import 'swiper/css/pagination';
const HomeBanner = (props) => {
    const context = useContext(MyContext);

    return (
        <>
            <section className="container mt-3">
                <div className="homeBannerSection">
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={15}
                        modules={[Navigation, Pagination, Autoplay]}
                        navigation
                        pagination={{ clickable: true }}
                        loop={true}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false
                        }}

                        className="mySwiper"


                    >

{
                        props?.data?.length !== 0 && props?.data?.map((item, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <div className="item">
                                        <img src={item?.images[0]} />
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                    </Swiper>
                </div >
            </section>


        </>
    )
}


export default HomeBanner;