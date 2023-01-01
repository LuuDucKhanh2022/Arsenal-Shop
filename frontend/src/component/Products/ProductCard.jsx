import React from "react";
import clsx from "clsx";
import styles from "./ProductCard.module.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Rating } from "@material-ui/lab";
const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
 

  return (
    <>
      <Link
        className={clsx(styles.productCard)}
        to={`/products/${product.category.name}/${product.subCategory.name}/${product._id}`}
      >
        <img
          className={clsx(styles.img)}
          src={product.images[0].url}
          alt={product.name}
        />
        <p className={clsx(styles.p)}>{product.name}</p>
        <div className={clsx(styles.price)}>
          {product.offerPrice > 0 ? (
            <>
              <div
                className={clsx(styles.offerPrice)}
              >{`${product.offerPrice}`}<span>$</span></div>
              <div
                className={clsx(styles.realPrice)}
              >{`${product.price}`}<span>$</span></div>
            </>
          ) : (
            <div className={clsx(styles.offerPrice)}>{`${product.price}`}<span>$</span></div>
          )}
        </div>

        <div className={clsx(styles.ratings)}>
          <Rating {...options} />
          <span>({product.numOfReviews.total} Reviews)</span>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;
