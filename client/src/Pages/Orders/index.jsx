
import React, { useEffect, useState } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import { MdClose } from "react-icons/md";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Select from '@mui/material/Select'; 
import MenuItem from '@mui/material/MenuItem'; 
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import emptyCart from "../../assets/images/empty.png"
import { Link } from "react-router-dom";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [statusFilter, setStatusFilter] = useState("pending"); 
    const history = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    
        const token = sessionStorage.getItem("token");
        if (token !== "" && token !== undefined && token !== null) {
            setIsLogin(true);
        } else {
            history("/signIn");
        }

        const user = JSON.parse(sessionStorage.getItem("user"));
        fetchDataFromApi(`/api/orders/own?userid=${user?.userId}`).then((res) => {
            setOrders(res);
           
        });
    }, []);

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value); 
    };

    const showProducts = (id) => {
        fetchDataFromApi(`/api/orders/${id}`).then((res) => {
            setIsOpenModal(true);
            setProducts(res.products);
        });
    };


    const filteredOrders = statusFilter ? orders.filter(order => order.status === statusFilter): orders;

    return (
        <>
            <section className="section">
                {/* <div className='container'>
                <FormControl size="small">
                <InputLabel id="Status">Status</InputLabel>

                    <Select labelId="Status" label="Status" className="mb-3" value={statusFilter} onChange={handleStatusChange}>

                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="confirm">Confirm</MenuItem>
                    </Select>
                    </FormControl>
                    <h2 className='hd'>Orders</h2>

                    <div className='table-responsive orderTable'>
                        <table className='table table-striped table-bordered'>
                            <thead className='thead-light'>
                                <tr>
                                    <th>Paymant Id</th>
                                    <th>Products</th>
                                    <th>Name</th>
                                    <th>Phone Number</th>
                                   
                                    <th>Pincode</th>
                                    <th>Total Amount</th>
                                    <th>Email</th>
                                   
                                    <th>Order Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    filteredOrders?.length !== 0 && filteredOrders?.map((order, index) => {
                                        return (
                                            <tr key={index}>
                                                <td><span className='text-blue font-weight-bold'>{order?.paymentId}</span></td>
                                                <td><span className='text-blue font-weight-bold cursor clicktopreview' onClick={() => showProducts(order?._id)}>Click here to view</span></td>
                                                <td>{order?.name}</td>
                                                <td>{order?.phoneNumber}</td>
                                               
                                                <td>{order?.pincode}</td>
                                                <td>{order?.amount}</td>
                                                <td>{order?.email}</td>
                                             
                                                <td>
                                                    {order?.status === "pending"
                                                        ? <span className='badge badge-danger'>{order?.status}</span>
                                                        : <span className='badge badge-success'>{order?.status}</span>
                                                    }
                                                </td>
                                                <td>{new Date(order?.date).toLocaleDateString("th-TH", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            timeZone: "Asia/Bangkok"
                                                        })}</td>

                                                
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div> */}

<div className='container'>
                    <FormControl size="small">
                        <InputLabel id="Status">Status</InputLabel>
                        <Select labelId="Status" label="Status" className="mb-3" value={statusFilter} onChange={handleStatusChange}>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="confirm">Confirm</MenuItem>
                        </Select>
                    </FormControl>
                    <h2 className='hd'>Orders</h2>

                    {filteredOrders.length > 0 ? (
                        <div className='table-responsive orderTable'>
                            <table className='table table-striped table-bordered'>
                                <thead className='thead-light'>
                                    <tr>
                                        <th>Payment Id</th>
                                        <th>Products</th>
                                        <th>Name</th>
                                        <th>Phone Number</th>
                                        <th>Pincode</th>
                                        <th>Total Amount</th>
                                        <th>Email</th>
                                        <th>Order Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order, index) => (
                                        <tr key={index}>
                                            <td><span className='text-blue font-weight-bold'>{order?.paymentId}</span></td>
                                            <td><span className='text-blue font-weight-bold cursor clicktopreview' onClick={() => showProducts(order?._id)}>Click here to view</span></td>
                                            <td>{order?.name}</td>
                                            <td>{order?.phoneNumber}</td>
                                            <td>{order?.pincode}</td>
                                            <td>{order?.amount}</td>
                                            <td>{order?.email}</td>
                                            <td>
                                                {order?.status === "pending"
                                                    ? <span className='badge badge-danger'>{order?.status}</span>
                                                    : <span className='badge badge-success'>{order?.status}</span>
                                                }
                                            </td>
                                            <td>{new Date(order?.date).toLocaleDateString("th-TH", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                timeZone: "Asia/Bangkok"
                                            })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty d-flex align-items-center justify-content-center flex-column">
                            <img src={emptyCart} width="150" alt="Empty Cart" />
                            <h3>Your Order is currently empty</h3>
                            <br />
                            <Link to="/"> 
                                <Button className='btn-blue bg-red btn-lg btn-big2 btn-round'>Continue Shopping</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <Dialog open={isOpenModal} className="productModal">
                <Button className='close_' onClick={() => setIsOpenModal(false)}><MdClose /></Button>
                <h4 className="mb-1 font-weight-bold pr-5 mb-4">Products</h4>

                <div className='table-responsive orderTable'>
                    <table className='table table-striped table-bordered'>
                        <thead className='thead-light'>
                            <tr>
                                <th>Product Id</th>
                                <th>Product Title</th>
                                <th>Image</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>SubTotal</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                products?.length !== 0 && products?.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item?.productId?.substr(0, 6) + '...'}</td>
                                            <td style={{ whiteSpace: "inherit" }}>
                                                <span>{item?.productTitle?.substr(0, 30) + '...'}</span>
                                            </td>
                                            <td>
                                                <div className='d-flex align-items-center img'>
                                                    <img src={item?.image} alt={item?.productTitle} />
                                                </div>
                                            </td>
                                            <td>{item?.quantity}</td>
                                            <td>{item?.price}</td>
                                            <td>{item?.subTotal}</td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </Dialog>
        </>
    );
};

export default Orders;
