import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../actions/OrderAction";
import { Link } from "react-router-dom";
import MetaData from "../../more/Metadata";
import LaunchIcon from "@material-ui/icons/Launch";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Loading from "../../more/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Home/Header";
import "./MyOrders.css";
import Footer from "../../Footer";
import Breadcrumbs from "../../more/Breadcrumbs";


const MyOrder = () => {
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.myOrder);

  const { user } = useSelector((state) => state.user);

  const columns = [
    { field: "id", headerName: "Order ID", flex: 0.5 },

    {
      field: "status",
      headerName: "Status",
      // minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    // {
    //   field: "itemsQty",
    //   headerName: "Items Qty",
    //   type: "number",
    //   // minWidth: 150,
    //   flex: 0.2,
    // },

    // {
    //   field: "amount",
    //   headerName: "Amount",
    //   type: "number",
    //   // minWidth: 270,
    //   flex: 0.2,
    // },

    {
      field: "actions",
      flex: 0.2 ,
      headerName: "Actions",
      // minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.getValue(params.id, "id")}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];
  const rows = [];

  orders &&
    orders.forEach((item, index) => {
      rows.push({
        id: item._id,
        status: item.orderStatus,
        // itemsQty: item.orderItems.length === 0 ? 1 : item.orderItems.length,
        // amount: item.totalPrice,
      });
    });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    dispatch(myOrders());
  }, [dispatch, error]);

  return (
    <Fragment>
      <MetaData title={`${user.name} - Orders`} />
      
      {loading ? (
        <Loading />
      ) : (
        <div className="myOrdersPage">
          <Header />
          <Breadcrumbs />
          <div className="myOrdersPage__main">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={8}
            disableSelectionOnClick
            className="myOrdersTable"
            autoHeight
          />
          </div> 
          <Footer />        
        </div>
      )}
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

export default MyOrder;
