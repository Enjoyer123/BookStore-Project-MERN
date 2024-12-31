import Button from '@mui/material/Button';
import { IoIosSearch } from "react-icons/io";
import { fetchDataFromApi } from '../../../utils/api';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../../App';

import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const SearchBox = (props) => {

    const [searchFields, setSearchFields] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const context = useContext(MyContext);

    const history = useNavigate();

    const onChangeValue = (e) => {
        setSearchFields(e.target.value);
    }


    // const searchProducts = () => {
        
    //     if(searchFields==""){
    //         context.setAlertBox({
    //             open: true,
    //             error: true,
    //             msg: 'Please Fill data.'
    //         });
    //         }else{
    //             context.setProgress(20)
    //             fetchDataFromApi(`/api/search?q=${searchFields}`).then((res) => {
                   
    //                 if (res && res.products.length > 0) { 
    //                     context.setSearchData(res);
    //                     history("/search");
    //                 } else {
    //                     context.setAlertBox({
    //                         open: true,
    //                         error: true,
    //                         msg: 'No product found!!!.'
    //                     });
    //                 }
                   
                        
    //                     context.setProgress(100)
                   
    //                 setIsLoading(false);
    //         })
            
    //     }
   
    // }

    const searchProducts = () => {
        if (searchFields == "") {
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please Fill data.'
            });
        } else {
            context.setProgress(20);
            
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `${import.meta.env.VITE_API_URL}/api/search?q=${searchFields}`, true);
            
            xhr.onload = function () {
                if (xhr.status === 200) {
                    const res = JSON.parse(xhr.responseText);
                   
                    if (res && res.products.length > 0) {
                        context.setSearchData(res);
                        history("/search");
                    } else {
                        context.setAlertBox({
                            open: true,
                            error: true,
                            msg: 'No product found!!!.'
                        });
                    }
                    context.setProgress(100);
                } else {
                    console.error('Error fetching data');
                }
                setIsLoading(false);
            };
    
            xhr.onerror = function () {
                console.error('Request failed');
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'Error fetching data.'
                });
                setIsLoading(false);
            };
    
            xhr.send();
        }
    }
    

   

    return (
        <div className='headerSearch'>
            <input type='text' placeholder='Search for products...' onChange={onChangeValue} />
            <Button onClick={searchProducts}>
                
                   <IoIosSearch />
                


            </Button>
        </div>
    )
}

export default SearchBox;