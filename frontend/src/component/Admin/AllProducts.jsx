import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  stopBusiness,
  getAdminProduct,
} from "../../actions/ProductActions";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import MetaData from "../../more/Metadata";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import SideBar from "./Sidebar";
import "./AllProducts.css";
import { ToastContainer, toast } from "react-toastify";
import { STOP_BUSINESS_RESET } from "../../constans/ProductConstans";

const AllProducts = ({ history }) => {
  const dispatch = useDispatch();

  const { error, products } = useSelector((state) => state.products);

  const { error: stopBusinessError, isStopBusinesses } = useSelector(
    (state) => state.updateProduct
  );

  const stopBusinessHandler = (id) => {
    if (
      window.confirm("Are you sure you want to stop selling this product?") ===
      true
    ) {
      dispatch(stopBusiness(id));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (stopBusinessError) {
      toast.error(stopBusinessError);
      dispatch(clearErrors());
    }

    if (isStopBusinesses) {
      toast.success("Stop businesss product Successfully");
      dispatch({ type: STOP_BUSINESS_RESET });
    }
    dispatch(getAdminProduct());
  }, [dispatch, history, stopBusinessError, isStopBusinesses, error]);

  const columns = [
    { field: "id", headerName: "Product ID", flex: 0.2 },

    {
      field: "name",
      headerName: "Name",
      flex: 0.2,
    },
    {
      field: "category",
      headerName: "category",
      flex: 0.19,
    },
    {
      field: "subcategory",
      headerName: "subcategory",
      flex: 0.19,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      flex: 0.11,
    },

    {
      field: "price",
      headerName: "Price",
      type: "number",
      flex: 0.11,
    },

    {
      field: "actions",
      flex: 0.09,
      headerName: "Actions",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                stopBusinessHandler(params.getValue(params.id, "id"))
              }
            >
              <HighlightOffIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.stock,
        price: item.price,
        name: item.name,
        category: item.category.name,
        subcategory: item.subCategory.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL PRODUCTS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">PRODUCTS</h1>
          <Link to="/admin/product" className="addProduct">
            <AddIcon />
            Add product
          </Link>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[8, 10]}
            disableSelectionOnClick
            className="listTable product"
            autoHeight
          />
        </div>
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
    </Fragment>
  );
};

export default AllProducts;
