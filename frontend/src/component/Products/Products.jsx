import clsx from "clsx";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Loading from "../../more/Loader";
import Footer from "../../Footer";
import Header from "../Home/Header";
import MetaData from "../../more/Metadata";
import { clearErrors, getProduct } from "../../actions/ProductActions";
import Pagination from "react-js-pagination";
import ProductList from "./ProductList";
import Breadcrumbs from "../../more/Breadcrumbs";
import "./Products.css";
import styles from "./Products.module.css";
// import { useAlert } from "react-alert";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
const Products = ({ match }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const query = useQuery();
  const param = useParams();
  const { products, loading, error, productsCount, resultPerPage } =
    useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  let subCategories = [];
  if (categories.toString() !== [].toString()) {
    if (param.category) {
      let category = categories.filter(
        (category) => category.name === param.category
      );
      subCategories = category[0].subCategories;
    } else {
      for (var i = 0; i < categories.length; i++) {
        subCategories = subCategories.concat(categories[i].subCategories);
      }
    }
  }

  function handelFilter(e) {
    let cateStr, perStr, sortStr, keyStr, pageStr, subCateStr;
    if (query.get("keyword") == null) {
      keyStr = "";
    } else {
      keyStr = `keyword=${query.get("keyword")}&`;
    }
    if (param.category) {
      cateStr = `/${param.category}`;
    } else {
      cateStr = "";
    }
    if (param.subcategory) {
      subCateStr = `/${param.subcategory}`;
    } else {
      subCateStr = "";
    }
    if (query.get("person") == null) {
      perStr = "";
    } else {
      perStr = `person=${query.get("person")}&`;
    }
    if (query.get("sort") == null) {
      sortStr = "";
    } else {
      sortStr = `sort=${query.get("sort")}&`;
    }
    if (query.get("page") == null) {
      pageStr = "";
    } else {
      pageStr = `page=${query.get("page")}`;
    }
    if (e.target === undefined) {
      `page=${e}` === "page=1" ? (pageStr = "") : (pageStr = `page=${e}`);
    } else {
      switch (e.target.name) {
        case "category":
          cateStr = `/${e.target.value}`;
          subCateStr = "";
          pageStr = "";
          break;
        case "subCategory":
          subCateStr = `/${e.target.value}`;
          const category = categories.find((category) =>
            category.subCategories.find(
              (subCategory) => subCategory.name === e.target.value
            )
          );
          cateStr = `/${category.name}`;
          pageStr = "";
          break;
        case "person":
          e.target.value === ""
            ? (perStr = "")
            : (perStr = `person=${e.target.value}&`);
          pageStr = "";
          break;
        case "sort":
          sortStr = `sort=${e.target.value}&`;
          pageStr = "";
          break;
        default:
      }
    }
    history.push(
      `/products${cateStr}${subCateStr}?${keyStr}${perStr}${sortStr}${pageStr}`
    );
  }

  useEffect(() => {
    if (error) {
      toast.alert(error);
      dispatch(clearErrors());
    }
    let cateStr, perStr, sortStr, keyStr, pageStr, subCateStr;
    if (query.get("keyword") == null) {
      keyStr = "";
    } else {
      keyStr = `keyword=${query.get("keyword")}&`;
    }
    if (param.category) {
      cateStr = `category=${param.category}&`;
    } else {
      cateStr = "";
    }
    if (param.subcategory) {
      subCateStr = `subcategory=${param.subcategory}&`;
    } else {
      subCateStr = "";
    }
    if (query.get("person") == null) {
      perStr = "";
    } else {
      perStr = `person=${query.get("person")}&`;
    }
    if (query.get("sort") == null) {
      sortStr = "";
    } else {
      sortStr = `sort=${query.get("sort")}&`;
    }
    if (query.get("page") == null) {
      pageStr = "";
    } else {
      pageStr = `page=${query.get("page")}`;
    }
    let link = `/api/v2/products?${keyStr}${cateStr}${subCateStr}${perStr}${sortStr}${pageStr}`;

    dispatch(getProduct(link));
  }, [dispatch, error, param.category, param.subcategory, query]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <MetaData title="Products" />
          <Header />
          <Breadcrumbs />
          <div className={clsx(styles.mainContent)} style={{ width: "100vm" }}>
            {query.get("keyword") !== null && (
              <div className={clsx(styles.searchResult)}>
                <h1 className={clsx(styles.title)}>{`Showing result for "${query.get("keyword")}"(${productsCount} products)`}</h1>
              </div>
            )}

            <div className={clsx(styles.filterSort, "flex")}>
              <div>
                <select
                  onChange={(e) => handelFilter(e)}
                  name="category"
                  id="category"
                  value={param.category ? param.category : ""}
                >
                  <option value="">All Category</option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
                <select
                  onChange={(e) => handelFilter(e)}
                  name="subCategory"
                  id="subCategory"
                  value={param.subcategory ? param.subcategory : ""}
                >
                  <option value="">All subcategory</option>
                  {subCategories &&
                    subCategories.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory.name}>
                        {subcategory.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <select
                  name="person"
                  id="category"
                  value={query.get("person") ? query.get("person") : ""}
                  onChange={handelFilter}
                >
                  <option value="">All subject</option>
                  <option value="everyone">Everyone</option>
                  <option value="men">Men</option>
                  <option value="woman">Woman</option>
                  <option value="kid">Kid</option>
                </select>
                <select
                  name="sort"
                  id=""
                  value={query.get("sort") ? query.get("sort") : ""}
                  onChange={(e) => handelFilter(e)}
                >
                  <option value="newest" className={clsx(styles.sortItem)}>
                    Newsest
                  </option>
                  <option value="price_asc" className={clsx(styles.sortItem)}>
                    Price(lowest first)
                  </option>
                  <option value="price_desc" className={clsx(styles.sortItem)}>
                    Price(highest first)
                  </option>
                  <option value="ratings" className={clsx(styles.sortItem)}>
                    Review Rating
                  </option>
                </select>
              </div>
            </div>
          </div>
          <ProductList products={products} />
          <Pagination
            activePage={query.get("page") ? parseInt(query.get("page")) : 1}
            itemsCountPerPage={resultPerPage}
            totalItemsCount={productsCount ? productsCount : 0}
            onChange={handelFilter}
            nextPageText=">"
            prevPageText="<"
            firstPageText="First"
            lastPageText="Last"
            itemClass="page-item"
            linkClass="page-link"
            activeClass="pageItemActive"
            activeLinkClass="pageLinkActive"
          />
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
          <Footer />
        </div>
      )}
    </>
  );
};

export default Products;
