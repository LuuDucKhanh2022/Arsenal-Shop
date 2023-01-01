import React from 'react';
import { Link } from 'react-router-dom';
import "./CartItemCard.css";

const CartItemCard = ({item, deleteCartItems}) => {
    return (
        <div className='CartItemCard'>
            <img src={item.image} alt="ssa" />
            <div>
                <Link to={`/product/${item.id}`}>{item.name}</Link>
                {
                    item.size === null ? <></>  :  <span>{`Size : ${item.size}`}</span>
                }
                <span>{`Price: $ ${item.price}`}</span> 
                <p onClick={() => deleteCartItems(item.id,item.size)}>Remove</p>
            </div>
        </div>
    ) 
}

export default CartItemCard
