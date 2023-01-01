import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import MetaData from "../../more/Metadata";
import { Country, State } from "country-state-city";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonIcon from "@material-ui/icons/Person";
import HomeIcon from "@material-ui/icons/Home";
import LocationCityIcon from '@material-ui/icons/LocationCity';
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import PublicIcon from "@material-ui/icons/Public";
import PhoneIcon from "@material-ui/icons/Phone";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import SideBar from "./Sidebar";
import { UPDATE_USER_RESET } from "../../constans/userContans";
import {
  getUserDetails,
  updateUser,
  clearErrors,
} from "../../actions/userAction";
import Loading from "../../more/Loader";
import { ToastContainer, toast } from "react-toastify";
import { useRef } from "react";
import "./UpdateUser.css";

const UpdateUser = ({ history, match }) => {
  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.userDetails);
  const { user: userUpdate, error: loadUserUpdateError } = useSelector(
    (state) => state.user
  );

  const {
    loading: updateLoading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");


  const selectRole = useRef();

  const userId = match.params.id;

  useEffect(() => {
    dispatch(getUserDetails(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    if (
      userUpdate.role === "admin" &&
      (user.role === "admin" || user.role === "root")
    ) {
      history.push("/");
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAddress(user.address ? user.address : "");
      setStateCode(user.stateCode ? user.stateCode : "");
      if(State.getStateByCodeAndCountry(user.stateCode, user.countryCode)) {
        setState(State.getStateByCodeAndCountry(user.stateCode, user.countryCode).name);
      }
      setCountryCode(user.countryCode ? user.countryCode : "");
      if(Country.getAllCountries().find( (item) => item.isoCode === user.countryCode)) {
       setCountry(Country.getAllCountries().find( (item) => item.isoCode === user.countryCode).name);
      }
      setPhoneNo(user.phoneNo ? user.phoneNo : "");
      setRole(user.role);
      if (user.role === "root") {
        selectRole.current.setAttribute("disabled", true);
      }
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (loadUserUpdateError) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    } else if (isUpdated) {
      toast.success("User Updated Successfully");
      history.push("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [countryCode, dispatch, error, history, isUpdated, loadUserUpdateError, updateError, user, userId, userUpdate.role]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("role", role);

    dispatch(updateUser(userId, myForm));
  };
  return (
    <Fragment>
      <MetaData title="Update User" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {loading ? (
            <Loading />
          ) : (
            <form
              className="createProductForm updateUserForm"
              onSubmit={updateUserSubmitHandler}
            >
              <h1>View user and update role</h1>

              <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  readOnly
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  readOnly
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <HomeIcon />
                <input
                  type="text"
                  placeholder="Address"
                  required
                  value={address}
                  readOnly
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <LocationCityIcon />
                <input
                  type="text"
                  placeholder="state"
                  required
                  value={state}
                  readOnly
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div>
                <PublicIcon />
                <input
                  type="text"
                  placeholder="country"
                  required
                  value={country}
                  readOnly
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              {/* <div>
                <PublicIcon />
                <select
                  required
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled
                >
                  <option value="">Country</option>
                  {Country &&
                    Country.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              {countryCode && (
                <div>
                  <TransferWithinAStationIcon />

                  <select
                    required
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value)}
                    disabled
                  >
                    <option value="">City</option>
                    {State &&
                      State.getStatesOfCountry(countryCode).map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              )} */}

              <div>
                <PhoneIcon />
                <input
                  type="text"
                  placeholder="Phone number"
                  required
                  value={phoneNo}
                  readOnly
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUserIcon />
                <select
                  ref={selectRole}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Choose Role</option>
                  <option disabled value="root">
                    root
                  </option>
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </select>
              </div>

              <Button
                id="createProductBtn"
                type="submit"
                disabled={
                  updateLoading ? true : false || role === "" ? true : false
                }
              >
                Update
              </Button>
            </form>
          )}
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
    </Fragment>
  );
};

export default UpdateUser;
