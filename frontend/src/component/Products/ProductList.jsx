import clsx from "clsx";
import React from "react";


import ProductCard from "./ProductCard";
import styles from "./ProductList.css";

const ProductList = ({products}) => {
  return (
    <>
    {products.length !== 0 ? (
      <div className="productList">
        {products.map ((product) => (
          <div className="col" key={product._id}>
            <ProductCard product={product}></ProductCard>
          </div>
        ))}
      </div>
    ) : (
      <div className="noProductFound">
        No Product Found!
      </div>
    )}
    </>
  )
}

export default ProductList;

