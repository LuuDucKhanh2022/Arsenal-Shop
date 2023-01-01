import React, { Fragment, useEffect, useState } from "react";
import "./CreateProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getCategoryDetails, updateCategory } from "../../actions/CategoryAction";
import { Button } from "@material-ui/core";
import MetaData from "../../more/Metadata";
import { UPDATE_CATEGORY_RESET } from "../../constans/CategoryConstans";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "./Sidebar";

const UpdateCategory = ({ history,match }) => {
  const dispatch = useDispatch();
  const { error, category } = useSelector((state) => state.categoryDetails);
  const [ name, setName ] = useState("");
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.updateCategory);
  const categoryId = match.params.id;

  useEffect ( () => {
    dispatch(getCategoryDetails(categoryId));
  },[dispatch, categoryId]);

  useEffect (()=> {
    setName(category.name);
  },[category])
  useEffect(() => {
    // if (category && category._id !== categoryId) {
    //   dispatch(getCategoryDetails(categoryId));
    // } else {
    //   setName(category.name);
    // }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Category Updated Successfully");
      history.push("/admin/categories");
      dispatch({ type: UPDATE_CATEGORY_RESET });
    }
  }, [dispatch, error, history, isUpdated, updateError, category, categoryId]);

  const updateCategorySubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    dispatch(updateCategory(categoryId, myForm));
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
            onSubmit={updateCategorySubmitHandler}
          >
            <h1>Update Category</h1>
            <div>
              <span>Category Name</span>
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button
                id="cupdateCategoryBtn"
                type="submit"
                disabled={loading ? true : false}
              >
                Update
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

export default UpdateCategory;
