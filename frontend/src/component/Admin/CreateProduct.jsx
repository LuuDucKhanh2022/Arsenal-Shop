import React, { Fragment, useEffect, useState, useRef } from "react";
import "./CreateProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createProduct } from "../../actions/ProductActions";
import { Button } from "@material-ui/core";
import MetaData from "../../more/Metadata";
import SideBar from "./Sidebar";
import { NEW_PRODUCT_RESET } from "../../constans/ProductConstans";
import { ToastContainer, toast } from "react-toastify";

const CreateProduct = ({ history }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const { loading, error, success } = useSelector(
    (state) => state.createProduct
  );

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [person, setPerson] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const [stock, setStock] = useState(0);
  const [curSizeName, setCurSizeName] = useState("");
  const [curSizeIndex, setCurSizeIndex] = useState(null);
  const [curSizeStock, setCurSizeStock] = useState(0);
  const sizeInput = useRef();
  const stockSize = useRef();
  const sizeForm = useRef();
  const stockInput = useRef();
  const imagesInput = useRef();
  const [images, setImages] = useState([]);
  const personList = ["everyone", "men", "woman", "kid"];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Product Created Successfully");
      history.push("/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, error, history, success]);

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

  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    offerPrice && myForm.set("offerPrice", offerPrice);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("subCategory", subCategory);
    myForm.set("person", person);
    myForm.set("size", JSON.stringify(sizeList));
    myForm.set("stock", stock);
    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(createProduct(myForm));
  };
  const handleCategory = (e) => {
    if (e.target.value !== "") {
      const currentCate = categories.find(
        (item) => item.name === e.target.value
      );
      setCategory(currentCate._id);
      setSubCategories(currentCate.subCategories);
    }
  };

  const handleSubCategory = (e) => {
    if (e.target.value !== "") {
      const currentSubCate = subCategories.find(
        (item) => item.name === e.target.value
      );
      setSubCategory(currentSubCate._id);
    }
  };
  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      toast.error("6 images maximum!");
    } else {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            // setImagesPreview((old) => [...old, reader.result]);
            setImages((old) => [...old, reader.result]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const resetImagesList = (e) => {
    e.preventDefault();
    imagesInput.current.value = null;
    setImages([]);
  };

  return (
    <Fragment>
      <MetaData title="Create Product" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>

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
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                />
              </div>
              <div>
                <span style={{ display: "inline" }}>Offer Price(optional)</span>
                <input
                  type="number"
                  value={offerPrice && offerPrice}
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
                <span>Subcategory</span>
                <select required onChange={(e) => handleSubCategory(e)}>
                  <option value="">Choose Category</option>
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
                readOnly={sizeList.length > 0 ? true : false}
                onChange={(e) => setStock(parseInt(e.target.value))}
              />
            </div>

            <div>
              <input
                required
                ref={imagesInput}
                type="file"
                name="avatar"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
              />
              <button onClick={resetImagesList}>Reset</button>
            </div>

            <div className="previewImages">
              <div className="previewImages__title">Product Image List</div>
              <div className="previewImages__list">
                {images &&
                  images.map((image, index) => (
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
    </Fragment>
  );
};

export default CreateProduct;
