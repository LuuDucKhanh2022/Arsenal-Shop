import React, { Fragment, useEffect, useState } from "react";
import "./CreateProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createCategory } from "../../actions/CategoryAction";
import { Button } from "@material-ui/core";
import MetaData from "../../more/Metadata";
import { NEW_CATEGORY_RESET } from "../../constans/CategoryConstans";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "./Sidebar";

const CreateCategory = ({ history }) => {
  const dispatch = useDispatch();
  const { error, loading, success } = useSelector((state) => state.createCategory);
  const [ name, setName ] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Category Created Successfully");
      history.push("/dashboard");
      dispatch({ type: NEW_CATEGORY_RESET });
    }
  }, [dispatch, error, history, success]);

  const createCategorySubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    dispatch(createCategory(myForm));
  };
  return (
    <>
      <MetaData title="CreateProduct" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createCategorySubmitHandler}
          >
            <h1>Create Category</h1>
            <div>
              <span>Category Name</span>
              <input
                type="text"
                placeholder="Category Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button
                id="createCategoryBtn"
                type="submit"
                disabled={loading ? true : false}
              >
                Create
              </Button>
          </form>
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
    </>
  );
};

export default CreateCategory;
