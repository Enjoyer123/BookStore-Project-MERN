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
    const [discountList, setDiscountList] = useState([])
    const [ogDiscountList, setOgDiscountList] = useState([])

    const ITEM_HEIGHT = 48;
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(40);
        fetchDataFromApi('/api/discount').then((res) => {
            setDiscountList(res)
            
            context.setProgress(100);
        })

        fetchDataFromApi('/api/ogdiscount').then((res) =>{
            setOgDiscountList(res)
        })
    }, []);

    
    const deleteSubDiscount  = (id)=>{
        
        deleteData(`/api/ogdiscount/${id}`).then((res) => {
            fetchDataFromApi(`/api/ogdiscount`).then((res) => {
                console .log("res",res)
                setOgDiscountList(res);
              
            })
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
                            label="Promotions"
                            deleteIcon={<ExpandMoreIcon />}

                        />
                    </Breadcrumbs>
                    <Link to="/discount/add"><Button className="btn-blue">+</Button></Link>
                </div>

                <div className="card shadow border-0 p-3 mt-4">
            

                <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Month</th>
                                    <th>Discount %</th>
                                    <th>Action</th>
                                   
                                </tr>
                            </thead>

                            <tbody>


                                {
                                    discountList?.length !== 0 && discountList?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                
                                                
                                                <td>{item?.month}</td>
                                                <td>{item?.discountPercentage}</td>
                                               
                                                <td>
                                                    <div className="actions d-flex align-items-center justify-content-center">

                                                
                                                        <Link to={`/discount/edit/${item?.id}`}>
                                                            <Button className="success" color="success"><FaPencilAlt /></Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }



                            </tbody>

                        </table>

                       

                </div>

                
                </div>
            </div>
        </>
    )
}

export default Product;