import React, { Fragment, useEffect, useState } from "react";
import "./CreateProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createSubCategory } from "../../actions/SubCategoryAction";
import { Button } from "@material-ui/core";
import MetaData from "../../more/Metadata";
import { NEW_SUBCATEGORY_RESET } from "../../constans/SubCategoryConstans";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "./Sidebar";

const CreateSubCategory = ({ history }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const { error, loading, success } = useSelector((state) => state.createSubCategory);
  const [ name, setName ] = useState("");
  const [ category,setCategory]= useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Subcategory Created Successfully");
      history.push("/admin/subcategories");
      dispatch({ type: NEW_SUBCATEGORY_RESET });
    }
  }, [dispatch, error, history, success]);

  const handleCategory = (e) => {
    if (e.target.value !== "") {
      const currentCate = categories.find(
        (item) => item.name === e.target.value
      );
      setCategory(currentCate._id);
    }
  };
  const createSubCategorySubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("category",category)
    dispatch(createSubCategory(myForm));
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
            onSubmit={createSubCategorySubmitHandler}
          >
            <h1>Create Subcategory</h1>
            <div>
                <span>Category</span>
                <select required onChange={(e) => handleCategory(e)}>
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
                placeholder="Subcategory Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
           
            <Button
                id="createSubCategoryBtn"
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

export default CreateSubCategory;
