import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState } from 'react';
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { fetchDataFromApi, postData, deleteData, uploadImage, deleteImages } from '../../utils/api';
import { MyContext } from '../../App';
import { useContext, useEffect } from 'react';
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

const AddPromotion = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoading2, setIsLoading2] = useState(false)

    const context = useContext(MyContext);
    const [error_, setError] = useState(false)
    const [imgFiles, setImgFiles] = useState('');
    const [isSelectedFiles, setIsSelectedFiles] = useState(false);
    const formdata = new FormData();
    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false);
    const [formFields, setFormFields] = useState({
        month: 0,
        discountPercentage: 0

    });


    const [ogDiscount, setOgDiscount] = useState(0)


    const changeInput = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
    }

    const changeInput2 = (e) => {

        setOgDiscount(e.target.value)
    }

    const history = useNavigate();

    const addDiscount = (e) => {

        e.preventDefault();


        formdata.append('name', formFields.name);
        formdata.append('discountPercentage', formFields.discountPercentage);

        if (formFields.month !== "") {


            postData(`/api/discount/create-monthly-discount`, formFields).then((res) => {

                setIsLoading(true);

                history('/discount');
            });

        }

        else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please fill all the details'
            });
            return false;
        }

    }


    const addOgDiscount = (e) => {
        e.preventDefault()


        if (ogDiscount !== "") {


            postData(`/api/ogdiscount/create`, { ogdiscount: ogDiscount }).then((res) => {

                setIsLoading2(true);

                history('/discount');
            });

        }

        else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please fill all the details'
            });
            return false;
        }

    }

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-3 align-items-center">
                    <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                        />
                        <StyledBreadcrumb
                            component="a"
                            label="Promotion"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Add"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={addDiscount}>
                    <div className='row'>
                        <div className='col card-big'>
                            <div className='card p-4'>

                                <div className='form-group'>
                                    <h6>Number of Mount</h6>
                                    <input type='text' name="month" value={formFields.month} onChange={changeInput} />
                                </div>

                                <div className='form-group'>
                                    <h6>Discount %</h6>
                                    <input type='text' name="discountPercentage" value={formFields.discountPercentage} onChange={changeInput} />
                                </div>





                                <Button type="submit" disabled={uploading === true ? true : false} className="btn-blue btn-lg btn-big w-100"
                                ><FaCloudUploadAlt /> &nbsp;  {isLoading === true ? <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}  </Button>

                            </div>

                        </div>
                    </div>
                </form>

               
            </div>
        </>
    )
}


export default AddPromotion;
