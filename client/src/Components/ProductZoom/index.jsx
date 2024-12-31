
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { useState, useRef } from 'react';

const ProductZoom = (props) => {
    const [slideIndex, setSlideIndex] = useState(0)

    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    const goto = (index) => {
        setSlideIndex(index)
        zoomSlider.current.swiper.slideTo(index);
        zoomSliderBig.current.swiper.slideTo(index);

    };
    return (
        <>
            <div className="productZoom">
                <div className='productZoomBig position-relative'>
                    <div className='badge'>{props.discount}%</div>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={0}
                        navigation={false}
                        modules={[Navigation]}

                        className="zoomSliderBig "
                        ref={zoomSliderBig}



                    >

                        {
                            props?.images?.map((img, index) => {
                                return (
                                    <SwiperSlide key={index}>

                                        <div className='item'>
                                            <InnerImageZoom
                                                zoomType="hover" zoomScale={1}
                                                src={img}
                                            />

                                        </div>
                                    </SwiperSlide>

                                )
                            })
                        }




                    </Swiper>




                </div>
                <Swiper
                    slidesPerView={4}
                    spaceBetween={0}
                    navigation={true}
                    slidesPerGroup={1}
                    modules={[Navigation]}

                    className="zoomSlider"
                    ref={zoomSlider}

                >


                    {
                        props?.images?.map((img, index) => {
                            return (
                                <SwiperSlide key={index}>

                                    <div className={`item ${slideIndex === index && 'item_active'}`} >
                                        <img className="w-100" src={img} alt="" onClick={() => goto(index)} />
                                    </div>
                                </SwiperSlide>

                            )
                        })
                    }

                </Swiper>
            </div>
        </>
    )

}

export default ProductZoom;