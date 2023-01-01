import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect,Route } from 'react-router-dom';

const ProtectedRoute = ({roles, component: Component, ...rest}) => {

    const {loading, isAuthenticated, user} = useSelector((state) => state.user);

    return (
       <>
        {loading === false && (
            <Route 
            {...rest}
            render={
                (props) => {
                    if(isAuthenticated === false){
                        return <Redirect to="/login" />
                    }
                    if(roles && !roles.includes(user.role)){
                        return  <Redirect to="/login" />
                    }
                    return <Component {...props} />
                }
            }
            />
        )}
       </>
    )
}

export default ProtectedRoute
