import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import MetaData from "../../more/Metadata";
import SearchIcon from "@material-ui/icons/Search";
import notFound from "../../Assets/no-product-found.webp";
import styles from "./Search.module.css";
import { useEffect } from "react";

const Search = ({ history }) => {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [productCount, setProductsCount] = useState(0);
  // const [historySearch, setHistorySearch] = useState(
  //   localStorage.getItem("historySearch") === null
  //     ? []
  //     : localStorage.getItem("historySearch").split(",")
  // );
  const historySearch =
    localStorage.getItem("historySearch") === null
      ? []
      : localStorage.getItem("historySearch").split(",");
  useEffect(() => {
    if (keyword !== "") {
      let result;
      async function fetchData() {
        result = await fetch(`/api/v2/products?keyword=${keyword}`);
        result = await result.json();

        setProducts(result.products);
        setProductsCount(result.productsCount);
      }
      fetchData();
    } else {
      setProducts([]);
    }
  }, [keyword]);

  const searchSubmitHandler = (e) => {
    e.preventDefault();

    if (historySearch.includes(keyword) === false) {
      historySearch.unshift(keyword);
    }
    localStorage.setItem("historySearch", historySearch.toString());

    if (keyword.trim()) {
      history.push(`/products?keyword=${keyword}`);
    } else {
      history.push("/products");
    }
  };
  return (
    <Fragment>
      <MetaData title="Search" />
      <div className={clsx(styles.searchPage)}>
        <form className={clsx(styles.searchBox)} onSubmit={searchSubmitHandler}>
          <input
            type="text"
            placeholder="Search for items ..."
            onChange={(e) => setKeyword(e.target.value)}
          />
          <SearchIcon
            onClick={searchSubmitHandler}
            className={clsx(styles.searchIcon)}
          />
          <div className={clsx(styles.searchResult)}>
            {keyword === "" ? (
              <div className={clsx(styles.searchHistory)}>
                <p className={clsx(styles.title)}>Recent search</p>
                <div className={clsx(styles.searchHistoryList)}>
                  {historySearch.length > 0 ? (
                    historySearch.map((item) => (
                      <div
                        onClick={() =>
                          history.push(`/products?keyword=${item}`)
                        }
                        className={clsx(styles.searchHistoryItem)}
                      >
                        {item}
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: "center", fontSize: "x-large" }}>
                      No result!
                    </div>
                  )}
                </div>
              </div>
            ) : products.length > 0 ? (
              <div className={clsx(styles.result)}>
                <p className={clsx(styles.title)}>
                  Found <span>{productCount}</span> products
                </p>
                <ul
                  className={clsx(styles.productList)}
                  onClick={(e) => e.preventDefault()}
                >
                  {products.map((product) => (
                    <Link
                      to={`/products/${product.category.name}/${product.subCategory.name}/${product._id}`}
                      key={product._id}
                      className={clsx(styles.productCard)}
                    >
                      <img src={product.images[0].url} alt="Product" />
                      <div className={clsx(styles.detail)}>
                        <p>{product.name}</p>
                        <div className={clsx(styles.price)}>
                          <span>{product.price}</span> $
                        </div>
                      </div>
                    </Link>
                  ))}
                </ul>
              </div>
            ) : (
              <img
                src={notFound}
                alt="Not found"
                className={clsx(styles.notFound)}
              />
            )}
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Search;
