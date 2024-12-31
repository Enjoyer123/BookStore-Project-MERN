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
import { fetchDataFromApi, postData,deleteData,uploadImage,deleteImages  } from '../../utils/api';
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

const AddCategory = () => {
    const [isLoading, setIsLoading] = useState(false)
    const context = useContext(MyContext);
    const [error_, setError] = useState(false)
    const [imgFiles, setImgFiles] = useState('');
    const [isSelectedFiles, setIsSelectedFiles] = useState(false);
    const formdata = new FormData();
    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false);
    const [formFields, setFormFields] = useState({
        name: '',
        images: [],
        color: ''
    });
    const [previews, setPreviews] = useState([])


    // useEffect(() => {
    //     if (!imgFiles) return;
    //     let tmp = [];
    //     for (let i = 0; i < imgFiles.length; i++) {
    //         tmp.push(imgFiles[i]);
    //     }

    //     const objectUrls = tmp;
    //     setPreviews(objectUrls)

    //     //Free memory

    //     for (let i = 0; i < objectUrls.length; i++) {
    //         return () => {
    //             URL.revokeObjectURL(objectUrls[i])
    //         }
    //     }
    // }, [imgFiles])

    useEffect(()=>{

        fetchDataFromApi("/api/imageUpload").then((res)=>{
            res?.map((item)=>{
                item?.images?.map((img)=>{
                    deleteImages(`/api/category/deleteImage?img=${img}`).then((res) => {
                        deleteData("/api/imageUpload/deleteAllImages");
                    })
                })
            })
        })

    },[]);

    const changeInput = (e) => {
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        });
    }

    const history = useNavigate();

    
    
    const addCat = (e) => {
       
        e.preventDefault();
        img_arr = [];
            
         const appendedArray = [...previews, ...uniqueArray];

        
        formdata.append('name', formFields.name);
        
        // formFields.slug = formFields.name
         
        if (formFields.name !== "" ) {

            postData(`/api/category/create`, formFields).then((res) => {
                setIsLoading(true);
                 context.fetchCategory();
                 context.fetchSubCategory()
                


                deleteData("/api/imageUpload/deleteAllImages");

                history('/category');
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
                            label="Category"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Add Category"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={addCat}>
                    <div className='row'>
                        <div className='card-big col'>
                            <div className='card p-4'>

                                <div className='form-group'>
                                    <h6>Catagory Name</h6>
                                    <input type='text' name="name" value={formFields.name} onChange={changeInput} />
                                </div>

                                <div className='imagesUploadSec'>
                                  
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

export default AddCategory;
