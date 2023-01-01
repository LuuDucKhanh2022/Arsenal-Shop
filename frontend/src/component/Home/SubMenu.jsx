import React from "react";
import { useState } from "react";
import Category from "./Category";

const SubMenu = ({ className,categories, history }) => {
    const [openCategory,setOpenCategory] = useState("");
    const activeCategory = (id) => {
        setOpenCategory(id);
    }
    return (
    <div className={className}> 
      {categories &&
        categories.map((item) => (
          <Category
            category={item}
            history={history}
            key={item._id}
            id={item._id}
            isOpen= {item._id === openCategory ? true : false}
            activeCategory={activeCategory}
          />
        ))}
    </div>
  );
};

export default SubMenu;
