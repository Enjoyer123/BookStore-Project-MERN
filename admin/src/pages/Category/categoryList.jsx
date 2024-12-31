
import { useContext, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import { Chart } from "react-google-charts";
import * as React from 'react';

import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';
import { LazyLoadImage } from 'react-lazy-load-image-component';


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


const Catagory = () => {

    const [catData, setCatData] = useState([])

    const context = useContext(MyContext);

    const [editId, setEditId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(20)

        fetchDataFromApi('/api/category').then((res) => {
            setCatData(res);


            context.setProgress(100)

        })
    }, []);

    

    const deleteCategory = (id) => {

        deleteData(`/api/category/${id}`).then((res) => {
            fetchDataFromApi(`/api/category`).then((res) => {
                setCatData(res);
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'Category Deleted!'
                })
            })
        })

    }

    const handleChange = (event, value) => {

        context.setProgress(40)
        fetchDataFromApi(`/api/category?page=${value}`).then((res) => {
            setCatData(res);

            context.setProgress(100)
        })
    }
    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-3 aligm-items-center">

                    <div className="d-flex justify-content-between align-items-center w-100">
                        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
                            <StyledBreadcrumb
                                component="a"
                                href="#"
                                label="Dashboard"
                                
                            />

                            <StyledBreadcrumb
                                label="Category"
                                deleteIcon={<ExpandMoreIcon />}

                            />
                        </Breadcrumbs>

                        <Link to="/category/add">
                            <Button className="btn-blue">+</Button>
                        </Link>
                    </div>
                </div>





                <div className="card shadow border-0 p-2 mt-4">

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered table-striped v-align">
                            <thead className="thead-dark">
                                <tr>
                                    <th>CATEGORY</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>

                            <tbody>


                                {

                                    catData?.categoryList?.length !== 0 && catData?.categoryList?.map((item, index) => {
                                        return (

                                            <tr key={index}>


                                                <td>{item.name}</td>

                                                <td>
                                                    <div className="actions d-flex align-items-center justify-content-center">

                                                        <Link to={`/category/add/${item.id}`}>
                                                            <Button className="success" color="success"><FaPencilAlt />
                                                            </Button>
                                                        </Link>
                                                        <Button className="error" color="error" onClick={() => deleteCategory(item.id)}><MdDelete /></Button>
                                                    </div>
                                                </td>

                                            </tr>
                                        )
                                    })
                                }



                            </tbody>

                        </table>


                        {catData?.totalPages > 1 &&
                            <div className="d-flex tableFooter">
                                <Pagination count={catData?.totalPages} className="pagination"
                                    onChange={handleChange} />
                            </div>
                        }

                    </div>


                </div>
            </div>

           
        </>
    )
}

export default Catagory;