// import DashboardBox from "./components/dashboardBox";
import { HiDotsVertical } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useContext, useEffect, useState } from "react";
import { IoIosTimer } from "react-icons/io";
import Button from '@mui/material/Button';
import { Chart } from "react-google-charts";
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from "react-router-dom";
import Bar from "./components/bar"
import Line from "./components/line"

// import Donut from "./components/donut"

import Rating from '@mui/material/Rating';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };



export const options = {
    'backgroundColor': 'transparent',
    'chartArea': { 'width': '100%', 'height': '100%' },
};


const Dashboard = () => {
    const [anchorEl, setAnchorEl] = useState(false);
    const [showBy, setshowBy] = useState('');
    const [showBysetCatBy, setCatBy] = useState('');
    const open = Boolean(anchorEl);
    const [categoryVal, setcategoryVal] = useState('');
    const [monthSale, setMonthSale] = useState(0)
    const [monthOrders, setMonthOrders] = useState(0)
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalProducts, setTotalProducts] = useState(0)
    const [orders, setOrders] = useState([]);
    const [productList, setProductList] = useState([])

    const ITEM_HEIGHT = 48;

    const context = useContext(MyContext);

    useEffect(() => {
        context.setisHideSidebarAndHeader(false);
        window.scrollTo(0, 0);
        context.setProgress(40);
        fetchDataFromApi('/api/orders/monthly-sales').then((res) => {
            setMonthSale(res.monthlySales)
        })
        fetchDataFromApi('/api/orders/total-orders').then((res) => {
            setMonthOrders(res.totalOrders)

        })
        fetchDataFromApi('/api/user/total-users').then((res) => {
            setTotalUsers(res.totalUsers)

        })
        fetchDataFromApi('/api/products/total-product').then((res) => {
            setTotalProducts(res.totalProducts)

        })

        fetchDataFromApi('/api/products').then((res) => {
            setProductList(res)

        })
        context.setProgress(100);
    }, []);

    const deleteProduct = (id) => {
        context.setProgress(40);
        deleteData(`/api/products/${id}`).then((res) => {
            context.setProgress(100);
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Product Deleted!'
            })

            fetchDataFromApi("/api/products").then((res) => {
                setProductList(res)
            })
        })

    }

    const handleChange = (event, value) => {
        context.setProgress(40)
        fetchDataFromApi(`/api/products?page=${value}`).then((res) => {
            setProductList(res);

            context.setProgress(100)
        })
    }

    const handleChangeCategory = (event) => {
        setcategoryVal(event.target.value);

    };
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };



    return (
        <>
            <div className="right-content">

                <div className="dashboardBoxWrapper">
                    <div className="dashboard_Box">


                        <div className="col1">
                            <h4 className="text-white mb-0">Total Products</h4>
                            <span className="text-white">{totalProducts}</span>
                        </div>

                        <div className="col1">
                            <h4 className="text-white mb-0">Month Sale</h4>
                            <span className="text-white">{monthSale}</span>
                        </div>

                        <div className="col1">
                            <h4 className="text-white mb-0">Total orders</h4>
                            <span className="text-white">{monthOrders}</span>
                        </div>
                        <div className="col1">
                            <h4 className="text-white mb-0">User</h4>
                            <span className="text-white">{totalUsers}</span>
                        </div>
                    </div>

                </div>

            </div>
            <div className="row m-auto chartBox">
                <div className="col-md-12 col-xl-6">
                    <Bar />

                </div>
                <div className="col-md-12 col-xl-6">
                    <Line />

                </div>
               

                <div className="col-md-12 col-xl-12">
                  

                    <div className="table-responsive mb-5">
                        <table className="table table-bordered table-striped v-align text-start">
                            <thead className="thead-dark">
                                <tr>
                                
                                    <th>PRODUCT</th>
                                    <th>NAME</th>
                                    <th>CATEGORY</th>
                                    <th>SUBCATEGORY</th>
                                    <th>AUTHOR</th>
                                    <th>PRICE</th>
                                    <th>RATING</th>
                                    <th>STOCK</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>


                                {
                                    productList?.products?.length !== 0 && productList?.products?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                               
                                                <td>

                                                <div className="imgWrapper d-flex align-items-center justify-content-center">
                                                             <img src={item.images[0]} className="w-50"/>
                                                            
                                                        </div>

                                                    
                                                </td>
                                                <td>{item?.name}</td>
                                                <td>{item?.catName}</td>

                                                <td>{item?.subCatName}</td>
                                                {/* <td>{item?.subCat.subCat}</td> */}
                                                <td>{item?.author}</td>
                                                <td>
                                                    <div style={{ width: '70px' }}>
                                                        <del className="old">${item.oldPrice}</del>
                                                        <span className="new text-danger">{item?.price}</span>
                                                    </div>
                                                </td>
                                                <td><Rating name="read-only" value={Number(item?.rating)} precision={0.5} size="small" readOnly /></td>
                                                <td>{item?.countInStock}</td>
                                                <td>
                                                    <div className="actions d-flex align-items-center">

                                                        <Link to={`/product/details/${item.id}`}>
                                                            <Button className="secondary" color="secondary">
                                                                <FaEye />
                                                            </Button>
                                                        </Link>
                                                        <Link to={`/product/edit/${item?.id}`}>
                                                            <Button className="success" color="success"><FaPencilAlt /></Button>
                                                        </Link>
                                                        <Button className="error" onClick={() => deleteProduct(item?.id)} color="error"><MdDelete /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }



                            </tbody>

                        </table>

                        {
                            productList?.totalPages > 1 &&
                            <div className="d-flex tableFooter">
                                
                                <Pagination count={productList?.totalPages} color="secondary" className="pagination"
                                      onChange={handleChange} />
                            </div>
                        }

                    </div>

                </div>

            </div>

        </>
    )
}

export default Dashboard;