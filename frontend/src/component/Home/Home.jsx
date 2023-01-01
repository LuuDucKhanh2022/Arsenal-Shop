import React, { useEffect } from "react";
import clsx from "clsx";
import styles from "./Home.module.css";
import Carousel from "react-material-ui-carousel";
import { Paper, Button} from '@material-ui/core';
import bg1 from "../../Assets/bg1.webp";
import bg2 from "../../Assets/bg2.webp";
import bg3 from "../../Assets/bg3.webp";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProduct, getProductCategory } from "../../actions/ProductActions";
import Header from "./Header";
import MetaData from "../../more/Metadata";
import Footer from "../../Footer";
import Loading from "../../more/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductSection from "../Products/ProductSection";
import "./Home.css";
import { useHistory } from "react-router-dom";


const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { productCategory, error, loading } = useSelector((state) => state.productCategory);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductCategory());
  }, [dispatch, error]);

  return (
    <>
    <MetaData title="Home" />
    <Header />
    {/* Carousel */}
    <div className="banner">
      <Carousel>
        <Paper  className="banner__paper" onClick={()=> history.push("/products/kit")}>
        <img alt="" src={bg1} className="bgImg" />
        <div className="banner__title">
                Official Arsenal Kits!<span>Check it out!</span>
        </div>
        </Paper>
        <Paper className="banner__paper" onClick={()=> history.push("/products/training")}>
        <img alt="" src={bg2} className="bgImg" />
        <div className="banner__title">
        22/23 Training Ranges!<span>Check it out!</span>
        </div>
        </Paper>
        <Paper className="banner__paper" onClick={()=> history.push("/products/gift and accessories")}>
        <img alt="" src={bg3} className="bgImg" />
        <div className="banner__title">
        Gifts & Accessories!<span>Check it out!</span>
        </div>
        </Paper>
      </Carousel>
    </div>
    <div className={clsx(styles.mainContent)}>
      {productCategory && productCategory.map( (item,index) => {
        return <ProductSection key={index} productCategory={item.products} title={item.category} />
      })}
    </div>

    <ToastContainer
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    <Footer />
  </>
  );
};

export default Home;
