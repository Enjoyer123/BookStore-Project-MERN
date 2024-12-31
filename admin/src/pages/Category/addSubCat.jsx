import React from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { useState, useContext } from "react";
import { FaRegImages } from "react-icons/fa";
import { fetchDataFromApi, postData,deleteData,uploadImage,deleteImages  } from '../../utils/api';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { IoCloseSharp } from "react-icons/io5";

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

const AddSubCat = () => {
    const [isLoading, setIsLoading] = useState(false)
    const history = useNavigate();
    const [previews, setPreviews] = useState([])
    const [uploading, setUploading] = useState(false);
    const formdata = new FormData();

    const [categoryVal, setcategoryVal] = useState('');
    const [formFields, setFormFields] = useState({
        category: '',
        subCat: '',
       

    });

    const context = useContext(MyContext)

    const inputChange = (e) => {
        setFormFields(() => ({
            ...formFields,
            [e.target.name]: e.target.value

        }))

    }
    const handleChangeCategory = (event) => {
        setcategoryVal(event.target.value);
        setFormFields(() => ({
            ...formFields,
            category: event.target.value

        }))
    };

   


    const addSubCat = (e) =>{
        e.preventDefault();
       
            
        
        const formdata = new FormData();
        formdata.append('category', formFields.category);
        formdata.append('subCat', formFields.subCat);
       
    

        if (formFields.category === "" ) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please select a category'
            });
            return false;
        }

        if (formFields.subCat=== "" ) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please select a category'
            });
            return false;
        }
       
      

        postData('/api/subCat/create', formFields).then((res) => {

            setIsLoading(false);
             context.fetchCategory();
             context.fetchSubCategory()
            


            deleteData("/api/imageUpload/deleteAllImages");

            history('/subCategory');
        });


    
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
                            label="SubCat"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="AddSubcat"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className="form" onSubmit={addSubCat}>
                    <div className="row">
                        <div className="card-big col">

                            <div className="card p-4 mt-0">
                                <div className="row">
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>CATEGORY</h6>
                                            <Select
                                                value={categoryVal}
                                                onChange={handleChangeCategory}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                className='w-100'
                                            >
                                                <MenuItem value="">
                                                    <em >None</em>
                                                </MenuItem>
                                                {
                                                    context.catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => {
                                                        return (
                                                            <MenuItem className="text-capitalize" value={cat.id} key={index}>{cat.name}</MenuItem>
                                                        )
                                                    })
                                                }

                                            </Select>
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>SUB CATEGORY</h6>
                                            <input type='text' name='subCat' value={formFields.subCat} onChange={inputChange} />
                                        </div>
                                    </div>

                                    <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                                        {

                                            isLoading === true ? <CircularProgress color="inherit" className="loader" /> : "PUBLISH AND VIEW"
                                        }
                                    </Button>
                                    
                                </div>

                            
                            </div>

                        </div>

                    </div>

                </form>
            </div>

        </>


    )




}


export default AddSubCat;