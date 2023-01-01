import React, { Fragment, useEffect, useState } from "react";
import "./CreateProduct.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getSubCategoryDetails,
  updateSubCategory,
} from "../../actions/SubCategoryAction";
import { Button } from "@material-ui/core";
import MetaData from "../../more/Metadata";
import { UPDATE_SUBCATEGORY_RESET } from "../../constans/SubCategoryConstans";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "./Sidebar";

const UpdateSubCategory = ({ history, match }) => {
  const dispatch = useDispatch();
  const { error, subCategory } = useSelector(
    (state) => state.subCategoryDetails
  );
  const { categories } = useSelector((state) => state.categories);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.updateSubCategory);
  const subCategoryId = match.params.id;

  useEffect(() => {
    dispatch(getSubCategoryDetails(subCategoryId));
  }, [dispatch, subCategoryId]);

  useEffect(() => {
    if (JSON.stringify(subCategory) !== "{}") {
      setName(subCategory.name);
      setCategory(subCategory.category._id);
      const curCate = categories.find(
        (cate) => cate._id === subCategory.category._id
      );
      setCategoryName(curCate.name);
    }
  }, [categories, subCategory]);
  useEffect(() => {
    // if (subCategory && subCategory._id !== subCategoryId) {
    //     console.log(1)
    //   dispatch(getSubCategoryDetails(subCategoryId));
    // } else {
    //   setName(subCategory.name);
    //   setCategory(subCategory.category_id);
    //   const curCate = categories.find( (cate) => cate._id === subCategory.category._id);
    //   setCategoryName(curCate.name);
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
      toast.success("Subcategory Updated Successfully");
      history.push("/admin/subcategories");
      dispatch({ type: UPDATE_SUBCATEGORY_RESET });
    }
  }, [dispatch, error, history, isUpdated, categories, updateError]);

  const handleCategory = (e) => {
    if (e.target.value !== "") {
      const curCate = categories.find((cate) => cate.name === e.target.value);
      setCategory(curCate._id);
      setCategoryName(curCate.name);
    }
  };
  const updateSubCategorySubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("category", category);
    dispatch(updateSubCategory(subCategoryId, myForm));
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
            onSubmit={updateSubCategorySubmitHandler}
          >
            <h1>Update Subcategory</h1>
            <div>
              <span>Category</span>
              <select
                value={categoryName}
                required
                onChange={(e) => handleCategory(e)}
              >
                <option value="">Choose Category</option>
                {categories &&
                  categories.map((cate) => (
                    <option key={cate._id} value={cate.name}>
                      {cate.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <span>Subcategory Name</span>
              <input
                type="text"
                placeholder="subCategory Name"
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

export default UpdateSubCategory;
