import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./AllProducts.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  stopBusinessCategory,
  getAllCategories,
} from "../../actions/CategoryAction";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import MetaData from "../../more/Metadata";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import SideBar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import { STOP_BUSINESS_CATEGORY_RESET } from "../../constans/CategoryConstans";

const AllCategories = ({ history }) => {
  const dispatch = useDispatch();

  const { error, categories } = useSelector((state) => state.categories);

  const { error: stopBusinessError, isStopBusinesses } = useSelector(
    (state) => state.updateCategory
  );

  const stopBusinessCategoryHandler = (id) => {
    dispatch(stopBusinessCategory(id));
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
      toast.success("Category stop business successfully");
      dispatch({ type: STOP_BUSINESS_CATEGORY_RESET });
    }
    dispatch(getAllCategories());
  }, [dispatch, error, history, stopBusinessError, isStopBusinesses]);

  const columns = [
    { field: "id", headerName: "Category ID", flex: 0.4 },

    {
      field: "name",
      headerName: "Name",
      flex: 0.8,
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
            <Link to={`/admin/category/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                stopBusinessCategoryHandler(params.getValue(params.id, "id"))
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

  categories &&
    categories.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL CATEGORIES - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL CATEGORIES</h1>
          <Link to="/admin/category" className="addProduct">
            <AddIcon />
            Add category
          </Link>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10,8]}
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

export default AllCategories;
