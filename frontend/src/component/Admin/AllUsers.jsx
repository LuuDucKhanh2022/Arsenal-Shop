import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./CreateProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import MetaData from "../../more/Metadata";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constans/userContans";
import { ToastContainer, toast } from "react-toastify";

const AllUsers = ({ history }) => {
  const dispatch = useDispatch();

  const { error, users } = useSelector((state) => state.allUsers);
  const { user, error: userError } = useSelector((state) => state.user);

  const {
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.profile);

  const deleteUserHandler = (id) => {
    let userUpdateRole;
    userUpdateRole = users.find((item) => item._id === id).role;
    if (user.role === "admin" && (userUpdateRole === "admin" || userUpdateRole === "root")) {
      toast.error("admin doesn't have this permission");
    } else {
      dispatch(deleteUser(id));
    }
    
  };

  const moveToUpdateUser = (id) => {
    let userUpdateRole;
    userUpdateRole = users.find((item) => item._id === id).role;
    if (user.role === "admin" && (userUpdateRole === "admin" || userUpdateRole === "root")) {
      toast.error("admin doesn't have this permission");
    } else {
      history.push(`/admin/user/${id}`);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (userError) {
      toast.error(userError);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success(message);
      history.push("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, error, deleteError, history, isDeleted, message, userError]);

  const columns = [
    { field: "id", headerName: "User ID", flex: 0.8 },

    {
      field: "email",
      headerName: "Email",
      // minWidth: 200,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      // minWidth: 150,
      flex: 0.5,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      // minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "greenColor"
          : "redColor";
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      // minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              onClick={() => moveToUpdateUser(params.getValue(params.id, "id"))}
            >
              <EditIcon />
            </Button>

            <Button
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL USERS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[8,10]}
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

export default AllUsers;
