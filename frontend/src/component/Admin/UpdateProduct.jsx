import React, { Fragment, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateProduct,
  getProductDetails,
} from "../../actions/ProductActions";
import { Button } from "@material-ui/core";
import MetaData from "../../more/Metadata";
// eslint-disable-next-line
import DiscountIcon from "@material-ui/icons/LocalOffer";
import SideBar from "./Sidebar";
import { UPDATE_PRODUCT_RESET } from "../../constans/ProductConstans";
import "./CreateProduct.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify";

const UpdateProduct = ({ history, match }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const { error, product } = useSelector((state) => state.productDetails);

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.updateProduct);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState({ name : ""});
  const [subCategory, setSubCategory] = useState({ name : ""});
  const [subCategories, setSubCategories] = useState([]);
  const [person, setPerson] = useState("everyone");
  const [sizeList, setSizeList] = useState([]);
  const [stock, setStock] = useState(0);
  const [curSizeName, setCurSizeName] = useState("");
  const [curSizeIndex, setCurSizeIndex] = useState(null);
  const [curSizeStock, setCurSizeStock] = useState(0);
  const sizeInput = useRef();
  const stockSize = useRef();
  const sizeForm = useRef();
  const stockInput = useRef();
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
 

  const personList = ["everyone", "men", "woman", "kid"];


  const productId = match.params.id;
  useEffect ( () => {
    dispatch(getProductDetails(productId));
  },[dispatch, productId]);

  useEffect ( () => {
    if(JSON.stringify(product) !== '{}') {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setOfferPrice(product.offerPrice);
      setSizeList(product.size);
      setCategory(product.category);
      setSubCategory(product.subCategory);
      let curCate = categories.find( (category) => category.name === product.category.name);
      curCate && setSubCategories(curCate.subCategories);
      setPerson(product.person ? product.person : "everyone");
      setStock(product.stock);
      setImages(product.images);
    }
   
  },[categories, product]);

  useEffect(() => {
    // if (product && product._id !== productId) {
    //   dispatch(getProductDetails(productId));
    // } else {
    //   setName(product.name);
    //   setDescription(product.description);
    //   setPrice(product.price);
    //   setOfferPrice(product.offerPrice);
    //   setSizeList(product.size);
    //   setCategory(product.category);
    //   setSubCategory(product.subCategory);
    //   const curCate = categories.find( category => category.name === product.category.name);
    //   setSubCategories(curCate.subCategories);
    //   setPerson(product.person ? product.person : "everyone");
    //   setStock(product.stock);
    //   setImages(product.images);
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
      history.push("/admin/products");
      dispatch({ type: UPDATE_PRODUCT_RESET });
    }
  }, [dispatch, error, history, isUpdated, updateError]);

  const handleAddSize = (e) => {
    e.preventDefault();
    let newSizeList = [...sizeList];
    if (curSizeIndex === null) {
      const newSize = { name: curSizeName, stock: curSizeStock };
      newSizeList = [...newSizeList, newSize];
    } else {
      newSizeList[curSizeIndex].name = curSizeName;
      newSizeList[curSizeIndex].stock = curSizeStock;
    }
    sizeForm.current.reset();
    sizeInput.current.focus();
    let totalStock = 0;
    newSizeList.forEach((item) => {
      totalStock += item.stock;
    });
    stockInput.current.value = totalStock;
    setStock(totalStock);
    setCurSizeIndex(null);
    setSizeList(newSizeList);
  };

  const removeSize = (e) => {
    e.preventDefault();
    if (curSizeIndex !== null) {
      const newSizeList = [...sizeList];
      stockInput.current.value -= newSizeList[curSizeIndex].stock;
      newSizeList.splice(curSizeIndex, 1);
      setSizeList(newSizeList);
      setCurSizeIndex(null);
      sizeForm.current.reset();
    }
  };
  const updateSize = (index) => {
    sizeInput.current.value = sizeList[index].name;
    stockSize.current.value = sizeList[index].stock.toString();
    setCurSizeIndex(index);
  };

  const handleCategory = (e) => {
    if (e.target.value !== "") {
      const currentCate = categories.find(
        (item) => item.name === e.target.value
      );
      setCategory(currentCate);
      setSubCategories(currentCate.subCategories);
    }
  };

  const handleSubCategory = (e) => {
    if (e.target.value !== "") {
      const currentSubCate = subCategories.find(
        (item) => item.name === e.target.value
      );
      setSubCategory(currentSubCate);
    }
  };
  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    offerPrice && myForm.set("offerPrice", offerPrice);
    myForm.set("description", description);
    myForm.set("category", category._id);
    myForm.set("subCategory", subCategory._id);
    myForm.set("person", person);
    myForm.set("size", JSON.stringify(sizeList));
    myForm.set("stock", stock);
    newImages.forEach((image) => {
      myForm.append("images", image);
    });
    dispatch(updateProduct(productId, myForm));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setNewImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Edit Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateProductSubmitHandler}
          >
            <h1>Edit Product</h1>

            <div>
              <span>Product Name</span>
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <div>
                <span>Price</span>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                />
              </div>
              <div>
                <span style={{ display: "inline" }}>Offer Price(optional)</span>
                <input
                  type="number"
                  value={offerPrice !== 0 && offerPrice}
                  onChange={(e) => setOfferPrice(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div style={{ alignItems: "flex-start" }}>
              <span>Description</span>
              <textarea
                required
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
                style={{
                  width: "616px",
                  height: "130px",
                }}
              ></textarea>
            </div>

            <div>
              <div>
                <span>Category</span>
                <select value={category.name} required onChange={(e) => handleCategory(e)}>
                  <option value="" >Choose Category</option>
                  {categories &&
                    categories.map((cate) => (
                      <option key={cate._id} value={cate.name}>
                        {cate.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <span>Subcategory</span>
                <select value={subCategory.name} required onChange={(e) => handleSubCategory(e)}>
                  <option value="" >Choose Category</option>
                  {subCategories &&
                    subCategories.map((subCate) => (
                      <option key={subCate._id} value={subCate.name}>
                        {subCate.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <span>Person</span>
              <select onChange={(e) => setPerson(e.target.value)} name="" id="">
                {personList.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <form className="sizeForm" ref={sizeForm} action="">
                <span>Size</span>
                <input
                  ref={sizeInput}
                  onChange={(e) => setCurSizeName(e.target.value)}
                  type="text"
                />
                <span style={{ marginLeft: "16px" }}>Stock</span>
                <input
                  ref={stockSize}
                  onChange={(e) => setCurSizeStock(parseInt(e.target.value))}
                  type="number"
                />
                <button
                  style={{ marginLeft: "16px" }}
                  onClick={(e) => handleAddSize(e)}
                >
                  Add or update
                </button>
                <button
                  style={{ marginLeft: "16px" }}
                  onClick={(e) => removeSize(e)}
                >
                  Remove
                </button>
              </form>
            </div>

            <div>
              {sizeList.length > 0 &&
                sizeList.map((item, index) => (
                  <div
                    className="sizeBox"
                    key={item.index}
                    onClick={() => updateSize(index)}
                  >
                    <div className="name">{`Size:${item.name}`}</div>
                    <div className="stock">{`Stock:${item.stock}`}</div>
                  </div>
                ))}
            </div>
            <div>
              <span>Stock</span>
              <input
                type="number"
                ref={stockInput}
                required
                value={stock}
                readOnly={sizeList.length > 0 ? true : false}
                onChange={(e) => setStock(parseInt(e.target.value))}
              />
            </div>

            <div className="previewImages">
              <div className="previewImages__title">Product Image List</div>
              <div className="previewImages__list">
              {images && images.map((image, index) => (
                <div key={index} className="previewImages__item">
                  <img key={index} src={image.url} alt="Product Preview" />
                </div>
              ))}
              </div>          
            </div>

            <div>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
            </div>

            <div className="previewImages">
              <div className="previewImages__title">New Product Image List</div>
              <div className="previewImages__list">
              {newImages && newImages.map((image, index) => (
                <div key={index} className="previewImages__item">
                  <img key={index} src={image} alt="Product Preview" />
                </div>
              ))}
              </div>          
            </div>

            <Button
              id="createProductBtn"
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
    </Fragment>
  );
};

export default UpdateProduct;
