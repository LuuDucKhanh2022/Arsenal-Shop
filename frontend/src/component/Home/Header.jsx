// eslint-disable-next-line
import React, { useRef } from "react";
import clsx from "clsx";

import { Link, NavLink, useHistory } from "react-router-dom";

import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import appLogo from "../../Assets/icons/arsenal-crest-logo.svg";
import HomeIcon from "@material-ui/icons/Home";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import PersonIcon from "@material-ui/icons/Person";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DynamicFeedIcon from "@material-ui/icons/DynamicFeed";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import styles from "./Header.module.css";
import { useState } from "react";
import { logout } from "../../actions/userAction";
import SubMenu from "./SubMenu";

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isAuthenticated, user,loading } = useSelector((state) => state.user);
  const [isLogout, setIsLogout] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const { favouriteItems } = useSelector((state) => state.favourite);
  const { categories, error } = useSelector(
    (state) => state.categories
  );
  const [toggleUserMenu, setToggleUserMenu] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleSubMenu, setToggleSubMenu] = useState(false);
  const switcherTab = useRef(null);

  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".Header_navbar__RlYp-");
    const navbarMobile = document.querySelector(".Header_navbarMobile__OtN8P");
    if (navbar)
      window.pageYOffset > 100
        ? navbar.classList.add("Header_active__Tlhkl")
        : navbar.classList.remove("Header_active__Tlhkl");
    if (navbarMobile)
      window.pageYOffset > 100
        ? navbarMobile.classList.add("Header_active__Tlhkl")
        : navbarMobile.classList.remove("Header_active__Tlhkl");
  });

  const toggleMenuHandle = () => {
    setToggleMenu(!toggleMenu);
    if (toggleSubMenu === true) {
      setToggleSubMenu(false);
    }
  };
  function logoutUser() {
    dispatch(logout());
    setIsLogout(true);
  }
  useEffect(() => {
    if(isLogout === true && loading === false) {
      history.push("/login")
    }
  },[history, isLogout, loading])
  // useEffect(() => {
  //   if (error) {
  //     toast.alert(error);
  //     dispatch(clearErrors());
  //   }
  //   dispatch(getAllCategories());
  // }, [dispatch, error]);
  return (
    <>
      <div className={clsx(styles.header)}>
        {/* Header TopBar */}
        <div className={clsx(styles.headerTopbar, "space-between")}>
          {/* Topbar Left */}
          <div>
            <Link to="/">
              <img
                src={appLogo}
                alt="App logo"
                className={clsx(styles.logo)}
              />
            </Link>
          </div>
          {/* Topbar Middle */}

          <div className={clsx(styles.searchBoxHome)}>
            <div className={clsx(styles.inputBox)}>
              <div>
                Welcome to Arsenal Shop!Where you can buy many arsenal related
                things and prove yourself a true gunner
              </div>
            </div>
          </div>

          <div className={clsx(styles.email)}>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-envelope"
                viewBox="0 0 16 16"
                style={{
                  color: "var(--main-color",
                }}
              >
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
              </svg>
            </div>
            <span>
              <strong
                style={{
                  padding: "0px 5px",
                }}
              >
                Email:
              </strong>{" "}
              temp123@gmail.com
            </span>
          </div>
        </div>
        {/* Header Navbar mobile */}
        <div className={clsx(styles.navbarMobile)}>
          <div>
            <NavLink
              activeClassName={clsx(styles.navLinkActive)}
              className={clsx(styles.navLink)}
              to="/"
            >
              <HomeOutlinedIcon
                style={{ fontSize: "35px" }}
                className={clsx(styles.icon)}
              />
              <HomeIcon
                style={{ fontSize: "35px" }}
                className={clsx(styles.icon)}
              />
            </NavLink>
          </div>
          <div>
            <NavLink
              activeClassName={clsx(styles.navLinkActive)}
              className={clsx(styles.navLink)}
              to="/search"
            >
              <SearchOutlinedIcon
                style={{ fontSize: "35px" }}
                className={clsx(styles.icon)}
              />
              <SearchIcon
                style={{ fontSize: "35px" }}
                className={clsx(styles.icon)}
              />
            </NavLink>
          </div>
          <div>
            <NavLink
              activeClassName={clsx(styles.navLinkActive)}
              className={clsx(styles.navLink, styles.heartProducts)}
              to="/favourites"
            >
              <FavoriteBorderOutlinedIcon
                style={{ fontSize: "35px" }}
                className={clsx(styles.icon)}
              />
              <FavoriteBorderIcon
                style={{ fontSize: "35px" }}
                className={clsx(styles.icon)}
              />
              <div className={clsx(styles.heartNumbers)}>
                <span>{favouriteItems.length}</span>
              </div>
            </NavLink>
          </div>
          <div>
            <NavLink
              activeClassName={clsx(styles.navLinkActive)}
              className={clsx(styles.navLink, styles.cartItems)}
              to="/cart"
            >
              <ShoppingCartOutlinedIcon
                style={{ fontSize: "35px" }}
                className={clsx(styles.icon)}
              />
              <ShoppingCartIcon
                style={{ fontSize: "35px" }}
                className={clsx(styles.icon)}
              />
              <div className={clsx(styles.heartNumbers)}>
                <span>{cartItems.length}</span>
              </div>
            </NavLink>
          </div>
          {isAuthenticated ? (
            <div
              onClick={() => setToggleUserMenu(!toggleUserMenu)}
              className={clsx(styles.userAccount)}
            >
              <img
                className={clsx(styles.avatar)}
                src={user.avatar.url}
                alt=""
              />
              <div
                className={
                  toggleUserMenu === false
                    ? clsx(styles.option)
                    : clsx(styles.option, styles.active)
                }
              >
                <div
                  onClick={() => {
                    history.push("/dashboard");
                  }}
                  className={ user.role === "user" ? clsx(styles.optionItem,styles.hide) : clsx(styles.optionItem)}
                >
                  <DashboardIcon className={clsx(styles.optionItemIcon)} />
                  <div className={clsx(styles.content)}>Dashboard</div>
                </div>
                <div
                  onClick={() => {
                    history.push("/orders");
                  }}
                  className={clsx(styles.optionItem)}
                >
                  <ListAltIcon className={clsx(styles.optionItemIcon)} />
                  <div className={clsx(styles.content)}>Orders</div>
                </div>
                <div
                  onClick={() => {
                    history.push("/me");
                  }}
                  className={clsx(styles.optionItem)}
                >
                  <PersonIcon className={clsx(styles.optionItemIcon)} />
                  <div className={clsx(styles.content)}>View Profile</div>
                </div>
                <div
                  onClick={() => {
                    history.push("/me/update/info");
                  }}
                  className={clsx(styles.optionItem)}
                >
                  <DynamicFeedIcon className={clsx(styles.optionItemIcon)} />
                  <div className={clsx(styles.content)}>Update Profile</div>
                </div>
                <div
                  onClick={() => {
                    history.push("/me/update");
                  }}
                  className={clsx(styles.optionItem)}
                >
                  <VpnKeyIcon className={clsx(styles.optionItemIcon)} />
                  <div className={clsx(styles.content)}>Change Password</div>
                </div>
                <div onClick={logoutUser} className={clsx(styles.optionItem)}>
                  <ExitToAppIcon className={clsx(styles.optionItemIcon)} />
                  <div className={clsx(styles.content)}>Logout</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <NavLink
                activeClassName={clsx(styles.navLinkActive)}
                className={clsx(styles.navLink)}
                to="/login"
              >
                <PersonOutlineOutlinedIcon
                  style={{ fontSize: "35px" }}
                  className={clsx(styles.icon)}
                />
                <PersonIcon
                  style={{ fontSize: "35px" }}
                  className={clsx(styles.icon)}
                />
              </NavLink>
            </div>
          )}
          <div className={clsx(styles.menuBar)} onClick={toggleMenuHandle}>
            {toggleMenu ? (
              <CloseIcon
                style={{ fontSize: "35px" }}
                className={clsx(styles.icon)}
              />
            ) : (
              <MenuIcon
                style={{ fontSize: "35px" }}
                className={clsx(styles.icon)}
              />
            )}
          </div>
          {toggleMenu && (
            <div className={clsx(styles.menu)}>
              <div className={clsx(styles.menuItem)}>
                <div className={clsx(styles.main)}>
                  <div
                    onClick={() => history.push("/products")}
                    className={clsx(styles.content)}
                  >
                    Product
                  </div>
                  <ExpandMoreIcon
                    className={
                      toggleSubMenu
                        ? clsx(styles.menuItemIcon, styles.active)
                        : clsx(styles.menuItemIcon)
                    }
                    style={{ fontSize: "60px", padding: "8px" }}
                    onClick={() => setToggleSubMenu(!toggleSubMenu)}
                  />
                </div>

                <SubMenu
                  className={
                    toggleSubMenu
                      ? clsx(styles.subMenu, styles.active)
                      : clsx(styles.subMenu)
                  }
                  categories={categories}
                  history={history}
                />
              </div>
              <div className={clsx(styles.menuItem)}>
                <div className={clsx(styles.main)}>
                  <div
                    onClick={() => history.push("/about")}
                    className={clsx(styles.content)}
                  >
                    About us
                  </div>
                </div>
              </div>
              <div className={clsx(styles.menuItem)}>
                <div className={clsx(styles.main)}>
                  <div
                    onClick={() => history.push("/faq")}
                    className={clsx(styles.content)}
                  >
                    FAQs
                  </div>
                </div>
              </div>
              <div className={clsx(styles.menuItem)}>
                <div className={clsx(styles.main)}>
                  <div
                    onClick={() => history.push("/contact")}
                    className={clsx(styles.content)}
                  >
                    Contact
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* navbar               */}
        <div className={clsx(styles.navbar)} ref={switcherTab}>
          <div className={clsx(styles.navigation)}>
            <ul>
              <Link className={clsx(styles.navbarItem)} to="/">
                <li>Home</li>
              </Link>
              <Link className={clsx(styles.navbarItem)} to="/about">
                <li>About us</li>
              </Link>
              <Link className={clsx(styles.navbarItem)} to="/products">
                <li>
                  Products
                  <ul className={clsx(styles.categoryList)}>
                    {categories &&
                      categories.map((category) => (
                        <Link
                          key={category._id}
                          to={`/products/${category.name}`}
                          className={clsx(styles.categoryItem)}
                        >
                          <li>{category.name}</li>
                          <ul className={clsx(styles.subcategoryList)}>
                            {category.subCategories &&
                              category.subCategories.map((subCategory) => (
                                <Link
                                  key={subCategory._id}
                                  to={`/products/${category.name}/${subCategory.name}`}
                                  className={clsx(styles.subcategoryItem)}
                                >
                                  <li>{subCategory.name}</li>
                                </Link>
                              ))}
                          </ul>
                        </Link>
                      ))}
                  </ul>
                </li>
              </Link>
              <Link className={clsx(styles.navbarItem)} to="/faq">
                <li>FAQs</li>
              </Link>
              <Link className={clsx(styles.navbarItem)} to="/contact">
                <li>Contact</li>
              </Link>
            </ul>
          </div>

          <div className={clsx(styles.rightOption)}>
            <div>
              <Link className={clsx(styles.item)} to="/search">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
              </Link>
            </div>
            <div>
              <Link
                className={clsx(styles.item, styles.heartProducts)}
                to="/favourites"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-heart"
                  viewBox="0 0 16 16"
                >
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                </svg>
                <div className={clsx(styles.heartNumbers)}>
                  <span>{favouriteItems.length}</span>
                </div>
              </Link>
            </div>
            <div>
              <Link className={clsx(styles.item, styles.cartItems)} to="/cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-cart3"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
                <div className={clsx(styles.heartNumbers)}>
                  <span>{cartItems.length}</span>
                </div>
              </Link>
            </div>
            {isAuthenticated ? (
              <div
                onClick={() => setToggleUserMenu(!toggleUserMenu)}
                className={clsx(styles.userAccount)}
              >
                <img
                  className={clsx(styles.avatar)}
                  src={user.avatar.url}
                  alt=""
                />
                <div
                  className={
                    toggleUserMenu === false
                      ? clsx(styles.option)
                      : clsx(styles.option, styles.active)
                  }
                >
                  {user.role === "user" ? (
                    <div></div>
                  ) : (
                    <div
                      onClick={() => {
                        history.push("/dashboard");
                      }}
                      className={clsx(styles.optionItem)}
                    >
                      <DashboardIcon className={clsx(styles.optionItemIcon)} />
                      <div className={clsx(styles.content)}>Dashboard</div>
                    </div>
                  )}
                  <div
                    onClick={() => {
                      history.push("/orders");
                    }}
                    className={clsx(styles.optionItem)}
                  >
                    <ListAltIcon className={clsx(styles.optionItemIcon)} />
                    <div className={clsx(styles.content)}>Orders</div>
                  </div>
                  <div
                    onClick={() => {
                      history.push("/me");
                    }}
                    className={clsx(styles.optionItem)}
                  >
                    <PersonIcon className={clsx(styles.optionItemIcon)} />
                    <div className={clsx(styles.content)}>View Profile</div>
                  </div>
                  <div
                    onClick={() => {
                      history.push("/me/update/info");
                    }}
                    className={clsx(styles.optionItem)}
                  >
                    <DynamicFeedIcon className={clsx(styles.optionItemIcon)} />
                    <div className={clsx(styles.content)}>Update Profile</div>
                  </div>
                  <div
                    onClick={() => {
                      history.push("/me/update");
                    }}
                    className={clsx(styles.optionItem)}
                  >
                    <VpnKeyIcon className={clsx(styles.optionItemIcon)} />
                    <div className={clsx(styles.content)}>Change Password</div>
                  </div>
                  <div onClick={logoutUser} className={clsx(styles.optionItem)}>
                    <ExitToAppIcon className={clsx(styles.optionItemIcon)} />
                    <div className={clsx(styles.content)}>Logout</div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Link className={clsx(styles.item)} to="/login">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-person"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
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
    </>
  );
};

export default Header;
