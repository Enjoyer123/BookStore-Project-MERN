
import { useContext, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { Chart } from "react-google-charts";
import * as React from 'react';

import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import { IoIosAdd } from "react-icons/io";


import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";

import { Link } from "react-router-dom";



import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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


const Promotion2List = () => {
    
    const [subCatDiscount, setSubCatDiscount] = useState([])
    
    const context = useContext(MyContext);

    const [editId, setEditId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [page,setPage] = useState(1)
    const [ogDiscountList, setOgDiscountList] = useState([])

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(20)

        fetchDataFromApi('/api/subdiscount').then((res) => {
            setSubCatDiscount(res);
          
            
            context.setProgress(100)
        })

        fetchDataFromApi('/api/ogdiscount').then((res) =>{
            setOgDiscountList(res)
        })
    }, []);



    const deleteSubDiscount  = (id)=>{
        
        deleteData(`/api/subdiscount/${id}`).then((res) => {
            fetchDataFromApi(`/api/subdiscount`).then((res) => {
                
                setSubCatDiscount(res);
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'OgDiscount Deleted!'
                })
              
            })
        })

    }

    const deleteOgDiscount  = (id)=>{
        
        deleteData(`/api/ogdiscount/${id}`).then((res) => {
            fetchDataFromApi(`/api/ogdiscount`).then((res) => {
                
                setOgDiscountList(res);
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'OgDiscount Deleted!'
                })
              
            })
        })

    }
    
    
    const applyDiscountToSubCat = async (name, discountPercentage) => {
        try {
            setIsLoading(true);
          
    
            const res = await editData(`/api/subdiscount/apply-discount-to-subcat`, {
                subCatName: name,
                discountPercentage: discountPercentage
            });
    
        
            
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetToOgDiscount = async ()=>{
        try {
            setIsLoading(true);
            
    
            const res = await editData(`/api/ogdiscount/update-all-discount-to-og`);
    
            
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-3 align-items-center">

                    <div className="d-flex align-items-center justify-content-between w-100">
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                        />

                        <StyledBreadcrumb
                            label="PromotionOg-PromoionSubcat"
                            deleteIcon={<ExpandMoreIcon />}

                        />
                    </Breadcrumbs>

                    {/* <Link to="/subdiscount/add"><Button className="btn-blue ms-3 ps-3 pe-3">+</Button></Link> */}
                    </div>
                </div>




                <div className="card shadow border-0 p-3 mt-4">


                <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>

                                    <th>ogdiscount</th>
                        
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    ogDiscountList?.length !== 0 && ogDiscountList?.map((item, index) => {
                                        return (

                                            <tr key={index}>
                                               
                                                                     

                                                <td>{item.ogdiscount}</td>
                                               
                                               
                        
                                                <td>
                                                    <div className="actions d-flex align-items-center">

                                                       <Link to={`/ogdiscount/edit/${item.id}`}> 
                                                       <Button className="success" color="success"><FaPencilAlt />
                                                       </Button>
                                                       </Link>
                                                       <Button className="error" color="error" onClick={() => deleteOgDiscount(item.id)}><MdDelete /></Button>

                                                        <Button className="blue" color="primary" onClick={() => resetToOgDiscount()}><IoIosAdd /></Button>

                                                    </div>
                                                </td>

                                            </tr>
                                        )
                                    })
                                }



                            </tbody>

                        </table>



                    </div>
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>

                                    <th>SUBCAT DISCOUNT</th>
                                    <th>DISCOUNT %</th>
                                
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    subCatDiscount?.length !== 0 && subCatDiscount?.map((item, index) => {
                                        return (

                                            <tr key={index}>
                                               
                                                                     

                                                <td>{item.subCatName}</td>
                                               
                                                <td>{item.discountPercentage}</td>
                                                
                                                <td>
                                                    <div className="actions d-flex align-items-center">

                                                       <Link to={`/subdiscount/edit/${item.id}`}> 
                                                       <Button className="success" color="success"><FaPencilAlt /></Button>
                                                       </Link>
                                                        <Button className="error" color="error" onClick={() => deleteSubDiscount(item.id)}><MdDelete /></Button>
                                                        <Button className="blue" color="primary" onClick={() => applyDiscountToSubCat(item.subCatName,item.discountPercentage)}><IoIosAdd /></Button>

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

export default Promotion2List;