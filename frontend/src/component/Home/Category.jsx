import clsx from 'clsx'
import React from 'react'

import ExpandMore from '@material-ui/icons/ExpandMore'
import { useState } from 'react'
import styles from "./Category.module.css"
import { useEffect } from 'react'
const Category = ({category,history,isOpen,id,activeCategory}) => {

    const [open, setOpen] = useState(isOpen);
    const handleOpen = () => {
        
        activeCategory(id);
        setOpen(!open);
    }
    
    useEffect(()=> {
        setOpen(isOpen);
    },[isOpen])
    return (
        <div   className={open ? clsx(styles.category,styles.active) : clsx(styles.category)}>
            <div className={clsx(styles.content)}>
                <div  onClick={()=> history.push(`/products/${category.name}`)}  className={clsx(styles.name)}>{category.name}</div>
                <ExpandMore onClick ={handleOpen} style={{fontSize:"60px",padding: "8px"}} className ={open ? clsx(styles.iconActive) : clsx(styles.icon)}/>
            </div>
            <div className={open? clsx(styles.subcategories,styles.active) : clsx(styles.subcategories)}>
                {
                    category.subCategories.map( (item) => (
                        <div key={item._id} onClick={ () => history.push(`/products/${category.name}/${item.name}`)} className={clsx(styles.item)}>{item.name}</div>
                    ))
                }
                
            </div>
        </div>
  )
}

export default Category