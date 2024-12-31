import React, { useEffect } from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchDataFromApi, postData ,editData,uploadImage ,deleteData,deleteImages} from '../../utils/api';
import { MyContext } from "../../App";
import { useState, useContext } from "react";
import { Link , useParams ,useNavigate} from "react-router-dom";
import { FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from 'react-lazy-load-image-component';

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

const EditSubCat = () => {
    const [previews, setPreviews] = useState([])
    const [uploading, setUploading] = useState(false);
    const formdata = new FormData();

    const [isLoading, setIsLoading] = useState(false)
    const history = useNavigate();
  let {id} = useParams();
    const [categoryVal, setcategoryVal] = useState('');
    const [formFields, setFormFields] = useState({
        category: '',
        subCat: '',
        images:[]

    });
const [data, setData] = useState([])
    const context = useContext(MyContext)

    useEffect(()=>{

        context.setProgress(20);
        fetchDataFromApi("/api/imageUpload").then((res)=>{
            res?.map((item)=>{
                item?.images?.map((img)=>{
                    deleteImages(`/api/category/deleteImage?img=${img}`).then((res) => {
                        deleteData("/api/imageUpload/deleteAllImages");
                    })
                })
            })
        })

        fetchDataFromApi(`/api/subCat/${id}`).then((res)=>{
            setData(res)
            setPreviews(res?.images);

            setcategoryVal(res.category.id)
            
            setFormFields(() => ({
                ...formFields,
                category: res.category.id,
                subCat: res.subCat,
                images:res.images
    
            }))
            context.setProgress(100);
        })
    },[])







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

    const editSubCat = (e) =>{
        e.preventDefault();
        const appendedArray = [...previews, ...uniqueArray];

        const formdata = new FormData();
        formdata.append('category', formFields.category);
        formdata.append('subCat', formFields.subCat);
        formdata.append('images', appendedArray);
        formFields.images = appendedArray

        
        if (formFields.category !== "" || formFields.subCat !== ""  ) {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please select a category'
            });

           
            editData(`/api/subCat/${id}`, formFields).then((res) => {

                setIsLoading(false);
                context.fetchSubCategory();
              

                deleteData("/api/imageUpload/deleteAllImages");
                history('/subCategory');
            })
            
        }else{
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please fill all the details'
            });
            return false;
    
        }

        

     

    }

    let img_arr = [];
    let uniqueArray = [];
    const onChangeFile = async (e, apiEndPoint) => {
        try {

            const files = e.target.files;


            setUploading(true);

            //const fd = new FormData();
            for (var i = 0; i < files.length; i++) {

                // Validate file type
                if (files[i] && (files[i].type === 'image/jpeg' || files[i].type === 'image/jpg' || files[i].type === 'image/png')) {

                    const file = files[i];

                    formdata.append(`images`, file);


                } else {
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: 'Please select a valid JPG or PNG image file.'
                    });

                    return false;
                }
            }

        } catch (error) {
            console.log(error)
        }



        uploadImage(apiEndPoint, formdata).then((res) => {

            fetchDataFromApi("/api/imageUpload").then((response) => {
                if (response !== undefined && response !== null && response !== "" && response.length !== 0) {

                    response.length !== 0 && response.map((item) => {
                        item?.images.length !== 0 && item?.images?.map((img) => {
                            img_arr.push(img)
                          
                        })
                    })

                    uniqueArray = img_arr.filter((item, index) => img_arr.indexOf(item) === index);

                    const appendedArray = [...previews, ...uniqueArray];

                  

                    setPreviews(appendedArray);
                    setTimeout(() => {
                        setUploading(false);
                        img_arr = [];
                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: "Images Uploaded!"
                        })
                    }, 500);

                }

            });

        });


    }


    const removeImg = async (index, imgUrl) => {

        const imgIndex = previews.indexOf(imgUrl);

        deleteImages(`/api/category/deleteImage?img=${imgUrl}`).then((res) => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: "Image Deleted!"
            })
        })

        if (imgIndex > -1) { 
            previews.splice(index, 1); 
        }

    }

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                 
                    <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Dashboard"
                            
                        />

                        <StyledBreadcrumb
                            component="a"
                            label="Sub Category"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="editSubcategory"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className="form" onSubmit={editSubCat}>
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

                                    
                                </div>

                            <div className='imagesUploadSec'>
                                    <h5>Media And Published</h5>

                                    <div className='imgUploadBox d-flex align-items-center'>

                                        {
                                            previews?.length !== 0 && previews?.map((img, index) => {
                                                return (
                                                    <div className='uploadBox' key={index}>
                                                        <span className="remove" onClick={() => removeImg(index, img,img.id)}><IoCloseSharp /></span>
                                                        <div className='box'>
                                                            <LazyLoadImage
                                                                alt={"image"}
                                                                effect="blur"
                                                                className="w-100"
                                                                src={img} />
                                                        </div>
                                                    </div>

                                                )

                                            })
                                        }

                                        <div className='uploadBox'>

                                            {
                                                uploading === true ?
                                                    <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                                                        <CircularProgress />
                                                        <span>Uploading...</span>
                                                    </div>
                                                    :

                                                    <>
                                                        <input type="file" multiple onChange={(e) => onChangeFile(e, '/api/subCat/upload')} name="images" />
                                                        <div className='info'>
                                                            <FaRegImages />
                                                            <h5>image upload</h5>
                                                        </div>
                                                    </>

                                            }

                                        </div>
                                    </div>
                                    <br />

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


export default EditSubCat;