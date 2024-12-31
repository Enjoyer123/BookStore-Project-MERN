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

import Rating from '@mui/material/Rating';
import { Link, useNavigate } from "react-router-dom";



import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import DashboardBox from "../Dashboard/components/dashboardBox";

import Checkbox from '@mui/material/Checkbox';
import { deleteData, fetchDataFromApi } from "../../utils/api";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});


const Product = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [showBy, setshowBy] = useState('');
    const [showBysetCatBy, setCatBy] = useState('');
    const open = Boolean(anchorEl);
    const [productList, setProductList] = useState([])
    const ITEM_HEIGHT = 48;
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(40);
        fetchDataFromApi('/api/products').then((res) => {
            setProductList(res)
            // console.log("Products ",res)
            context.setProgress(100);
        })
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
    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-3 align-items-center">
                   
                    <Breadcrumbs aria-label="breadcrumb" className="me-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                        />

                        <StyledBreadcrumb
                            label="Products"
                            deleteIcon={<ExpandMoreIcon />}

                        />
                    </Breadcrumbs>
                    <Link to="/product/upload"><Button className="btn-blue">+</Button></Link>
                </div>

                <div className="card shadow border-0 p-3 mt-4">

                    <div className="table-responsive mt-3">
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
                                
                                <Pagination count={productList?.totalPages} color="primary" className="pagination"
                                    showFirstButton showLastButton onChange={handleChange} />
                            </div>
                        }

                    </div>


                </div>
            </div>
        </>
    )
}

export default Product;