import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";

import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";

import { Link } from "react-router-dom";

import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { deleteData, editData, fetchDataFromApi } from "../../utils/api";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const BannersList = () => {
  const [slideList, setSlideList] = useState([]);

  const context = useContext(MyContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    context.setProgress(20);
    fetchDataFromApi("/api/banners").then((res) => {
      setSlideList(res);
      context.setProgress(100);
    });
  }, []);

  const deleteSlide = (id) => {
    // userInfo?.email==="admin9643@gmail.com"
    const userInfo = JSON.parse(sessionStorage.getItem("user"));
    if(userInfo){
      context.setProgress(30);
      deleteData(`/api/banners/${id}`).then((res) => {
        context.setProgress(100);
        context.setAlertBox({
          open: true,
          error: false,
          msg: "Banner Deleted!",
        });
        fetchDataFromApi("/api/banners").then((res) => {
          setSlideList(res);
          context.setProgress(100);

        });
      });
    }
     else{
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Only Admin can delete Banners",
      });
     }
    
   
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">

        <div className="d-flex justify-content-between align-items-center w-100">
        <Breadcrumbs
              aria-label="breadcrumb"
              className="ml-auto breadcrumbs_"
            >
              <StyledBreadcrumb
                component="a"
                href="#"
                label="Dashboard"
                
              />

              <StyledBreadcrumb
                label="Banners"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>

            <Link to="/banners/add">
              <Button className="btn-blue">
                +
              </Button>
            </Link>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped v-align">
              <thead className="thead-dark">
                <tr>
                  <th style={{ width: "200px" }}>IMAGE</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {slideList?.length !== 0 &&
                  slideList?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          
                           
                            <div className="imgWrapper d-flex align-items-center justify-content-center">
                             
              
                                <img
                                  alt={"image"}
                                 
                                  className="w-50"
                                  src={item.images[0]}
                                  />
                             
                                  
                         
                          </div>
                        </td>

                        <td>
                          <div className="actions d-flex align-items-center">
                            <Link to={`/banners/edit/${item.id}`}>
                              {" "}
                              <Button className="success" color="success">
                                <FaPencilAlt />
                              </Button>
                            </Link>

                            <Button
                              className="error"
                              color="error"
                              onClick={() => deleteSlide(item.id)}
                            >
                              <MdDelete />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannersList;