import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App1.css";
import "./responsive1.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { createContext, useEffect, useState, useRef } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import ProductUpload from "./pages/Products/addProduct";
import Category from "./pages/Category/categoryList";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import LoadingBar from 'react-top-loading-bar'
import EditCategory from "./pages/Category/editCategory";
import AddCategory from "./pages/Category/addCategory";
import EditProduct from "./pages/Products/editProduct"
import { fetchDataFromApi } from "../src/utils/api"
import SubCatAdd from "./pages/Category/addSubCat";
import SubCatList from "./pages/Category/subCategoryList";
import EditSubCat from "./pages/Category/editSubcat";
import Orders from "./pages/Orders";
import AddHomeBannerSlide from './pages/HomeBanner/addHomeSlide';
import HomeBannerSlideList from './pages/HomeBanner/homeSlideList';
import EditHomeBannerSlide from './pages/HomeBanner/editSlide';
import BannersList from './pages/Banners/bannerList';
import AddBanner from './pages/Banners/addHomeBanner';
import EditBanner from './pages/Banners/editHomeBanner';
import DiscountList from './pages/Promotions/promotionList';
import AddDiscount from './pages/Promotions/addPromotion';
import EditDiscount from './pages/Promotions/editPromotion'
import AddSubCatDiscount from "./pages/Promotions/addPromotion2";
import SubCatDiscountList from "./pages/Promotions/PromotionList2"
import EditSubCatDiscount from "./pages/Promotions/editPromotion2"
import EditOgDiscount from "./pages/Promotions/editOgDiscount"
import Orderscomplete from "./pages/Orders/orderComplete";
import Myaccount from "./pages/MyAccount";
import AddPromotionOg from "./pages/Promotions/addPromotionOg";




const MyContext = createContext();

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const toploadingBar = useRef(null)
  const [baseUrl, setBaseUrl] = useState('http://localhost:4000')
  const [catData, setCatData] = useState([])
  const [subCatData, setSubCatData] = useState([])
  const [user, setUser] = useState({
    name: '',
    email: "",
    userId: ''
  })
  const [alertBox, setAlertBox] = useState({
    msg: '',
    error: false,
    open: false
  })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);

      const userData = JSON.parse(sessionStorage.getItem("user"));
      setUser(userData);

    } else {
      setIsLogin(false);
    }


  }, [isLogin, sessionStorage.getItem("user")]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setProgress(20)
    fetchCategory();
    fetchSubCategory();

    setProgress(100)

  }, [])

  const fetchCategory = () => {
    try {
      fetchDataFromApi('/api/category').then((res) => {
        setCatData(res);


      })
    } catch (error) {
      console.log(error)
    }

  }


  const fetchSubCategory = () => {
    fetchDataFromApi('/api/subCat').then((res) => {
      setSubCatData(res);



    })
  }

  const openNav = () => {
    setIsOpenNav(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertBox(false);
  };

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    theme,
    setTheme,
    windowWidth,
    openNav,
    isOpenNav,
    setIsOpenNav,
    alertBox,
    setAlertBox,
    setProgress,
    baseUrl,
    catData,
    fetchCategory,
    fetchSubCategory,
    subCatData,
    user,
    setUser



  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <LoadingBar
          color='#f11946'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className="topLoadingBar"
        />
        {
          <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity={alertBox.error === false ? "success" : "error"}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {alertBox.msg}
            </Alert>
          </Snackbar>
        }
        {isHideSidebarAndHeader !== true && <Header />}

        <div className="main d-flex">
          {isHideSidebarAndHeader !== true && (
            <>
              <div
                className={`sidebarWrapper ${isToggleSidebar === true ? "toggle" : ""
                  } ${isOpenNav === true ? "open" : ""}`}
              >
                <Sidebar />
              </div>
            </>
          )}

          <div
            className={`content ${isHideSidebarAndHeader === true && "full"} ${isToggleSidebar === true ? "toggle" : ""
              }`}
          >
            <Routes>
              <Route path="/" exact={true} element={<Dashboard />} />

              <Route path="/dashboard" exact={true} element={<Dashboard />} />
              <Route path="/login" exact={true} element={<Login />} />
              <Route path="/signUp" exact={true} element={<SignUp />} />
              <Route path="/products" exact={true} element={<Products />} />
              <Route path="/discount/add" exact={true} element={<AddDiscount />} />
              <Route path="/discount" exact={true} element={<DiscountList />} />
              <Route path="/subdiscount/add" exact={true} element={<AddSubCatDiscount />} />
              <Route path="/subdiscount" exact={true} element={<SubCatDiscountList />} />
              <Route path="/my-account" exact={true} element={<Myaccount />} />
              <Route path="/promotionOg/add" exact={true} element={<AddPromotionOg />} />

              <Route
                path="/product/details/:id"
                exact={true}
                element={<ProductDetails />}
              />
              <Route
                path="/product/upload"
                exact={true}
                element={<ProductUpload />}
              />

              <Route
                path="/product/edit/:id"
                exact={true}
                element={<EditProduct />}
              />


              <Route
                path="/discount/edit/:id"
                exact={true}
                element={<EditDiscount />}
              />



              <Route
                path="/subdiscount/edit/:id"
                exact={true}
                element={<EditSubCatDiscount />}
              />

              <Route
                path="/ogdiscount/edit/:id"
                exact={true}
                element={<EditOgDiscount />}
              />

              <Route
                path="/category/add"
                exact={true}
                element={<AddCategory />}
              />

              <Route
                path="/subCategory/add"
                exact={true}
                element={<SubCatAdd />}
              />
              <Route
                path="/category/add/:id"
                exact={true}
                element={<EditCategory />}
              />

              <Route
                path="/category"
                exact={true}
                element={<Category />}
              />


              <Route
                path="/subCategory"
                exact={true}
                element={<SubCatList />}
              />


              <Route
                path="/subCategory/add"
                exact={true}
                element={<SubCatAdd />}
              />
              <Route
                path="/subCategory/edit/:id"
                exact={true}
                element={<EditSubCat />}
              />
              <Route path="/orders/" exact={true} element={<Orders />} />
              <Route path="/orders/complete" exact={true} element={<Orderscomplete />} />

              <Route path="/homeBannerSlide/add" exact={true} element={<AddHomeBannerSlide />} />
              <Route path="/homeBannerSlide/list" exact={true} element={<HomeBannerSlideList />} />
              <Route path="/homeBannerSlide/edit/:id" exact={true} element={<EditHomeBannerSlide />} />
              <Route path="/banners" exact={true} element={<BannersList />} />
              <Route path="/banners/add" exact={true} element={<AddBanner />} />
              <Route path="/banners/edit/:id" exact={true} element={<EditBanner />} />


            </Routes>

          </div>
        </div>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };
