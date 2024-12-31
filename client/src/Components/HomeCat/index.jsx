import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import React from "react";
import { Pagination, Navigation } from 'swiper/modules';
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useEffect } from 'react';
const HomeCat = (props) => {

    const [slidesPerView, setSlidesPerView] = useState(1); 


const updateSlidesPerView = () => {
    const width = window.innerWidth;

    if (width >= 1200) {
        setSlidesPerView(5); 
    } else if (width >= 768) {
        setSlidesPerView(5); 
    } else {
        setSlidesPerView(5); 
    }
};

useEffect(() => {
   
    updateSlidesPerView();

  
    window.addEventListener('resize', updateSlidesPerView);

    
    return () => {
        window.removeEventListener('resize', updateSlidesPerView);
    };
}, []);
    
    return (
        <>


            <section className="homeCat">
                <div className="info w-100 d-flex align-items-center justify-content-center flex-column">
                    <h3 className="mb-0 hd">FEATURED PRODUCTS</h3>
                    <p>Lorem ipsum dolor sit amet s quas?</p>
                </div>
                <div className="container">
                    <Swiper
                        slidesPerView={slidesPerView}
                        spaceBetween={2}
                        navigation={true}
                        modules={[Navigation]}
                        slidesPerGroup={1}
                        className="mySwiper"


                    >

                        {
                            props?.subCatData?.length !== 0 && props?.subCatData?.map((cat, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        
                                        <Link to={`/products/category/${cat.id}`}>
                                            <div className='item text-center cursor' style={{ background: cat.color }}>
                                                <img src={cat.images[0]} alt="" />
                                                

                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                )
                            })
                        }


                    </Swiper>
                </div>
            </section>

        </>
    )
}

export default HomeCat;