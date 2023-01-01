import React from "react";
import { Link, NavLink, Route, Switch } from "react-router-dom";
import withBreadcrumbs from "react-router-breadcrumbs-hoc";
import { BrowserRouter } from "react-router-dom";
import './Breadcrumbs.css';
const routes = [];
const Breadcrumbs = withBreadcrumbs(routes)(({ breadcrumbs }) => (
    <div className="breadcrumbs">
      {breadcrumbs.map(({ match, breadcrumb }) => (
        // other props are available during render, such as `location`
        // and any props found in your route objects will be passed through too
        <Link  className="breadcrumbs__link" key={match.url}>
          <NavLink to={match.url}>{breadcrumb}</NavLink>
        </Link>
      ))}
    </div>
  ));

  
  export default Breadcrumbs;