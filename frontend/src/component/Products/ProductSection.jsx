import React from 'react';
import clsx from "clsx";
import styles from "./ProductSection.module.css"
import { Link, useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductList from './ProductList';

const ProductSection = ({productCategory,title}) => {
  return (
    <div className={clsx(styles.productSection)}>
        <div className={clsx(styles.header)}>
            <Link to={`products/${title}`} className={clsx(styles.title)}>{title ? title: 'Related Product'}</Link>
            <Link to={`products/${title}`} className={clsx(styles.seeAll)}>See all</Link>
        </div>
        <ProductList products={productCategory} ></ProductList>
    </div>
  )
}

export default ProductSection