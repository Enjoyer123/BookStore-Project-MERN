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
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import { fetchDataFromApi, postData ,editData,uploadImage ,deleteData,deleteImages} from '../../utils/api';
import { MyContext } from '../../App';
import { useContext, useEffect } from 'react';

import {Link,useParams} from 'react-router-dom'
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

const EditCategory = () => {
    

    const [isLoading, setIsLoading] = useState(false)
    const context = useContext(MyContext);
    const [error_, setError] = useState(false)
    const [previews, setPreviews] = useState([])
    const [imgFiles, setImgFiles] = useState();
    const {id} = useParams();
    const formdata = new FormData();
    const [files, setFiles] = useState([])
    const [category, setcategory] = useState([]);
    const [isSelectedFiles, setIsSelectedFiles] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [ogDiscount , setOgDiscount] = useState(0)

   

    useEffect(() => {
        context.setProgress(20);
        
        fetchDataFromApi(`/api/ogdiscount/${id}`).then((res) => {
            setOgDiscount(res);
         
           
            
            context.setProgress(100);
        });
    }, []);



    const changeInput2 = (e) => {
    
        setOgDiscount(e.target.value)
    }

    const history = useNavigate();



   
    const editOgDiscount = (e) => {
        e.preventDefault();


        if (ogDiscount !== ""  ) {
            setIsLoading(true);

            editData(`/api/ogdiscount/${id}`, { ogdiscount: ogDiscount }).then((res) => {
              
                setIsLoading(false);
            
    
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
                            label="Edit Category"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>

                <form className='form' onSubmit={editOgDiscount}>
                    <div className='row'>
                        <div className='col card-big'>
                            <div className='card p-4'>

                                <div className='form-group'>
                                    <h6>ogdiscount</h6>
                                    <input type='number' name="ogDiscount" value={ogDiscount.ogdiscount} onChange={changeInput2} />
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

export default EditCategory;
