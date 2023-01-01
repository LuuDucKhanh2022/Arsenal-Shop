import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./AllProducts.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  stopBusinessSubCategory,
  getAllSubCategories,
} from "../../actions/SubCategoryAction";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import MetaData from "../../more/Metadata";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import SideBar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import { STOP_BUSINESS_SUBCATEGORY_RESET } from "../../constans/SubCategoryConstans";
import { getAllCategories } from "../../actions/CategoryAction";

const AllSubCategories = ({ history }) => {
  const dispatch = useDispatch();

  const { error, subCategories } = useSelector((state) => state.subCategories);
  const { error: getAllCategoryError, categories } = useSelector(
    (state) => state.categories
  );

  const { error: stopBusinessError, isStopBusinesses } = useSelector(
    (state) => state.updateSubCategory
  );

  const stopBusinessSubCategoryHandler = (id) => {
    dispatch(stopBusinessSubCategory(id));
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
      toast.success("Subcategory stop business Successfully");
      dispatch({ type: STOP_BUSINESS_SUBCATEGORY_RESET });
    }
    if (getAllCategoryError) {
      toast.error(stopBusinessError);
      dispatch(clearErrors());
    }
    dispatch(getAllSubCategories());
    dispatch(getAllCategories());
  }, [
    dispatch,
    error,
    history,
    stopBusinessError,
    isStopBusinesses,
    getAllCategoryError,
  ]);

  const columns = [
    { field: "id", headerName: "SubCategory ID", flex: 0.4 },

    {
      field: "name",
      headerName: "Name",
      flex: 0.6,
    },

    {
      field: "category",
      headerName: "Category",
      flex: 0.6,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/subcategory/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                stopBusinessSubCategoryHandler(params.getValue(params.id, "id"))
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

  subCategories &&
    subCategories.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        category: item.category.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL SUBCATEGORIES - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL SUBCATEGORIES</h1>
          <Link to="/admin/subcategory" className="addProduct">
            <AddIcon />
            Add subcategory
          </Link>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[8, 10]}
            disableSelectionOnClick
            className="listTable"
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

export default AllSubCategories;
