
import HomeBanner from "../../Components/HomeBanner";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { IoIosArrowRoundForward } from "react-icons/io";
import React, { useContext } from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import ProductItem from "../../Components/ProductItem";
import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import homeBannerPlaceholder from "../../assets/images/homeBannerPlaceholder.jpg";



const Home = () => {
    const [catData, setCatData] = useState([])
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [newProducts, setNewProducts] = useState([])

    const [RecommendProducts, setRecommendProducts] = useState([])

    const [productsData0, setProductsData0] = useState([])
    const [englishBooks, setenglishBooks] = useState([])
    const [bannerList, setBannerList] = useState([]);
    const [homeSlides, setHomeSlides] = useState([]);
    const [filterData, setFilterData] = useState([]);


    const context = useContext(MyContext)
    const [slidesPerView, setSlidesPerView] = useState(1); 

    // ฟังก์ชันเพื่อเช็คขนาดหน้าจอ
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
        window.scrollTo(0, 0);

       
            context.setisHeaderFooterShow(true);
    
        
        fetchDataFromApi(`/api/category`).then((res) => {
            setCatData(res)
           
        })

        fetchDataFromApi(`/api/products/featured`).then((item) => {
            setFeaturedProducts(item)
        })

        fetchDataFromApi(`/api/products/newrelease`).then((item) => {
            setNewProducts(item)
         
        })

        fetchDataFromApi(`/api/products/recommend`).then((item) => {
            setRecommendProducts(item)
          
        })


        fetchDataFromApi(`/api/products`).then((item) => {
            setProductsData0(item.products)
        })

        fetchDataFromApi("/api/homeBanner").then((res) => {
            setHomeSlides(res);
        });

    

        fetchDataFromApi("/api/banners").then((res) => {
            setBannerList(res);
        });

    }, [])


    return (
        <>

            {homeSlides?.length !== 0 ? (
                <HomeBanner data={homeSlides} />
            ) : (
                <section className="container mt-3">
                    <div className="homeBannerSection">
                        <img src={homeBannerPlaceholder} className="w-100" />
                    </div>
                </section>
            )}

            <section className="homeProducts">
                <main className="container">
                    <article className="row">
                        <aside className="m-auto col-sm-12 col-md-4 col-xl-4 ads">
                            <div className="banner m-auto ms-2">
                                <img src={bannerList[0]?.images} alt="" className="cursor homeBan" />
                            </div>
                        </aside>
                        <aside className="col-sm-12 col-md-8 col-xl-8 productRow mt-2">
                            <div className="d-flex align-items-center mb-2">
                                <div className="info w-75 ps-2 pe-4">
                                    <h3 className="mb-0 hd">NEW RELEASE</h3>
                                </div>
                              
                            </div>

                            <div className="product_row w-100">

                                {newProducts.products && newProducts.products.length > 0 ? (
                                    <Swiper
                                        slidesPerView={slidesPerView}
                                        spaceBetween={5}
                                        navigation={true}
                                        modules={[Navigation]}
                                        slidesPerGroup={1}
                                        className="mySwiper"
                                    >
                                        {newProducts.products.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <ProductItem item={item} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    <p>Loading featured products...</p>
                                )}

                            </div>
                        </aside>
                    </article>

                    <article className="row">
                        <div className="col-sm-12 col-md-12 productRow mt-2">
                            <div className="d-flex align-items-center mb-2">
                                <div className="info w-75 ps-2 pe-4">
                                    <h3 className="mb-0 hd">RECOMMEND</h3>
                                </div>
                               
                            </div>

                            <div className="product_row w-100">
                            {RecommendProducts.products && RecommendProducts.products.length > 0 ? (
                                    <Swiper
                                        slidesPerView={slidesPerView}
                                        spaceBetween={5}
                                        navigation={true}
                                        modules={[Navigation]}
                                        slidesPerGroup={1}
                                        className="mySwiper"
                                    >
                                        {RecommendProducts.products.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <ProductItem item={item} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    <p>Loading featured products...</p>
                                )}
                            </div>
                        </div>
                    </article>
                    <aside className="row">
                        <div className="d-flex mt-2 bannerSec">
                            <div className="banner1">
                                <img src={bannerList[1]?.images} alt="" className="cursor w-100" />
                            </div>
                            <div className="banner1">
                                <img src={bannerList[2]?.images} alt="" className="cursor w-100" />
                            </div>
                        </div>
                    </aside>
                    <article className="row">
                        <div className="col-sm-12 col-md-12 productRow mt-2">
                            <div className="d-flex align-items-center mb-2">
                                <div className="info w-75 ps-2 pe-4">
                                    <h3 className="mb-0 hd">FEATURED PRODUCTS</h3>
                                </div>
                                
                            </div>
                            <div className="product_row w-100">
                            {featuredProducts.products && featuredProducts.products.length > 0 ? (
                                    <Swiper
                                        slidesPerView={slidesPerView}
                                        spaceBetween={5}
                                        navigation={true}
                                        modules={[Navigation]}
                                        slidesPerGroup={1}
                                        className="mySwiper"
                                    >
                                        {featuredProducts.products.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <ProductItem item={item} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    <p>Loading featured products...</p>
                                )}
                            </div>
                        </div>
                    </article>

                
                </main>
            </section>
        </>
    )
}

export default Home;