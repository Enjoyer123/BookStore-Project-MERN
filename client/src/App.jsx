
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"
import "./respond.css"
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import Footer from "./Components/Footer";
// import ProductModal from "./Components/ProductModal";
import Listing from "./Pages/Listing";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart"
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import { fetchDataFromApi, postData } from "./utils/api";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MyList from "./Pages/MyList";
import Orders from "./Pages/Orders"
import SearchPage from "./Pages/Search";
import MyAccount from "./Pages/MyAccount";
// import Index from "./Pages/progress";
import Checkout from "./Pages/Checkout";
import LoadingBar from 'react-top-loading-bar'
import { useRef } from "react";
import Sidebar from "./Components/SidebarNav";

const MyContext = createContext();

function App() {
  const [isToggled, setIsToggled] = useState(true);

  // const [isOpenProductModal, setisOpenProductModal] = useState({
  //   id: '',
  //   open: false
  // })
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true)
  const [isLogin, setisLogin] = useState(false)
  const [productData, setProdutsData] = useState([])
  const [cartData, setCartData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [progress, setProgress] = useState(0)
  const toploadingBar = useRef(null)
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isToggleSidebarSetting, setisToggleSidebarSetting] = useState(true)
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [isOpenNav, setIsOpenNav] = useState(false);

  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setsubCategoryData] = useState([]);
  const [addingInCart, setAddingInCart] = useState(false);

  const [alertBox, setAlertBox] = useState({
    msg: "",
    error: false,
    open: false,
  });
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: "",
  });

  let [cartFields, setCartFields] = useState({});


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
      setisLogin(true);

      const userData = JSON.parse(sessionStorage.getItem("user"));

      setUser(userData);
    } else {
      setisLogin(false);
    }
  }, [isLogin]);


  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (
      user?.userId !== "" &&
      user?.userId !== undefined &&
      user?.userId !== null
    ) {
      fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
        setCartData(res);
      });
    }
  }, [isLogin]);

  useEffect(() => {
    setProgress(20)
    fetchDataFromApi("/api/category").then((res) => {
      setCategoryData(res.categoryList);
    })

    fetchDataFromApi("/api/subCat").then((res) => {
      setsubCategoryData(res.subCategoryList);

    })

    fetchDataFromApi("/api/cart").then((res) => {
      setCartData(res);
      setProgress(100)

    })
  }, [])



  // useEffect(() => {
  //   isOpenProductModal.open === true &&
  //     fetchDataFromApi(`/api/products/${isOpenProductModal.id}`).then((res) => {
  //       setProdutsData(res);
  //     })
  // }, [isOpenProductModal])

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertBox({
      open: false,
    });
  };


  const getCartData = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    fetchDataFromApi(`/api/cart?userId=${user?.userId}`).then((res) => {
      setCartData(res);
    });
  };


  const addtoCart = (data) => {


    if (isLogin) {

      setAddingInCart(true);
      postData(`/api/cart/add`, data).then((res) => {


        if (res.status !== false) {
          setAlertBox({
            open: true,
            error: false,
            msg: "Item is added in the cart",
          });

          setTimeout(() => {
            setAddingInCart(false);
          }, 1000);

          getCartData();
        } else {
          setAlertBox({
            open: true,
            error: true,
            msg: res.msg,
          });
          setAddingInCart(false);
        }
      });
    } else {

      setAlertBox({
        open: true,
        error: true,
        msg: "Please Login first",
      });



    }
  };

  const toggleSidebar = () => {
    setIsToggleSidebar((prev) => !prev);
    const sidebarElement = document.getElementById("sidebarWrapper");
    console.log(sidebarElement.id)
    if (sidebarElement) {
      if (isToggled) {
        sidebarElement.classList.remove("toggle");
      } else {
        sidebarElement.classList.add("toggle");
      }
      setIsToggled(!isToggled); 
    }
  };
  const values = {

    isHeaderFooterShow,
    setisHeaderFooterShow,
    isLogin,
    setisLogin,
    categoryData,
    setCategoryData,
    subCategoryData,
    setsubCategoryData,
    alertBox,
    setAlertBox,
    user,
    setUser,
    addtoCart,
    cartData,
    setCartData,
    addingInCart,
    setAddingInCart,
    getCartData,
    searchData,
    setSearchData,
    setProgress,
    progress,
    isToggleSidebar,
    setIsToggleSidebar,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    isToggleSidebarSetting,
    setisToggleSidebarSetting,
    setTheme,
    theme,
    toggleSidebar

  }
  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={values}>
          <LoadingBar
            color='#f11946'
            progress={progress}
            onLoaderFinished={() => setProgress(0)}
            className="topLoadingBar"
          />
          <Snackbar
            open={alertBox.open}
            autoHideDuration={6000}
            onClose={handleClose}
            className="snackbar"
          >
            <Alert
              onClose={handleClose}
              severity={alertBox.error === false ? "success" : "error"}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {alertBox.msg}
            </Alert>
          </Snackbar>

          {
            isHeaderFooterShow === true && <Header />
          }

          <main className="main">

            <>
              {/* <div
                className={`sidebarWrapper ${isToggleSidebar === true ? "toggle" : ""}`}
              >
                <Sidebar />
              </div> */}

<div id="sidebarWrapper" className="sidebarWrapper toggle">
    <Sidebar />
</div>


            </>




            <Routes>

              <Route path="/" exact={true} element={<Home />} />
              <Route path="/products/subCat/:subCatId" exact={true} element={<Listing />} />
              <Route path="/products/category/:id" exact={true} element={<Listing />} />

              <Route path="/product/:id" exact={true} element={<ProductDetails />} />
              <Route path="/cart" exact={true} element={<Cart />} />
              <Route path="/signin" exact={true} element={<SignIn />} />
              <Route path="/signup" exact={true} element={<SignUp />} />
              <Route exact={true} path="/my-list" element={<MyList />} />
              <Route exact={true} path="/checkout" element={<Checkout />} />
              <Route exact={true} path="/orders" element={<Orders />} />

              <Route exact={true} path="/search" element={<SearchPage />} />
              <Route exact={true} path="/my-account" element={<MyAccount />} />


            </Routes>
            {
              isHeaderFooterShow === true && <Footer />
            }


            {/* {isOpenProductModal.open === true && <ProductModal data={productData} />} */}

          </main>
        </MyContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App;

export { MyContext };