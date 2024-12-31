import { IoSettingsOutline } from "react-icons/io5";

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { MyContext } from '../../App';
import { useParams } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { MdClose } from "react-icons/md";
import Button from '@mui/material/Button';

const Sidebar = (props) => {

    const [value, setValue] = useState([0, 20000])
    const [value2, setValue2] = useState(0)
    const [subCatId, setSubCatId] = useState('')
    const context = useContext(MyContext);

    const [filterSubCat, setfilterSubCat] = useState('female');
    const { id } = useParams();

    useEffect(() => {
        setSubCatId(id)
    }, [id])

    const handleChange = (event) => {
        setfilterSubCat(event.target.value);
        props.filterData(event.target.value)
        setSubCatId(event.target.value)
    };

    useEffect(() => {
        props.filterByPrice(value)
    }, [value])

    const filterByRating = (rating) => {

        props.filterByRating(rating, subCatId)

    };


    return (
        <>

            <div className="sidebar">


            <Button className="close_" onClick={() => context.setisToggleSidebarSetting(!context.isToggleSidebarSetting)}>
                                    {
                                        <MdClose />
                                    }
                                </Button>

                <div className='filterBox'>
                    <h6>FILTER BY PRICE</h6>


                    <RangeSlider value={value} onInput={setValue} min={0} max={20000} step={5} />

                    <div className='d-flex pt-2 pb-2 priceRange'>
                        <span><strong className='text-dark'>฿{value[0]}</strong></span>
                        <span className='ms-auto'><strong className='text-dark'>฿{value[1]}</strong></span>

                    </div>
                </div>

        

                <div className="filterBox">
                    <h6>FILTER BY RATING</h6>

                    <div className='scroll'>
                        <ul>
                            <li onClick={() => filterByRating(5)}><Rating name="read-only" value={5} readOnly size="small" /></li>
                            <li onClick={() => filterByRating(4)}><Rating name="read-only" value={4} readOnly size="small" /></li>
                            <li onClick={() => filterByRating(3)}><Rating name="read-only" value={3} readOnly size="small" /></li>
                            <li onClick={() => filterByRating(2)}><Rating name="read-only" value={2} readOnly size="small" /></li>
                            <li onClick={() => filterByRating(1)}><Rating name="read-only" value={1} readOnly size="small" /></li>

                        </ul>




                    </div>
                </div>

            </div>

           

        </>
    )


}

export default Sidebar;