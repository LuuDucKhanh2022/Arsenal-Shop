import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CheckoutSteps from "../cart/CheckoutSteps.jsx";
import MetaData from "../../more/Metadata";
import HomeIcon from "@material-ui/icons/Home";
import PublicIcon from "@material-ui/icons/Public";
import PhoneIcon from "@material-ui/icons/Phone";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import { Country, State } from "country-state-city";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UPDATE_PROFILE_RESET } from "../../constans/userContans";
import "./Shipping.css";
import Header from "../Home/Header.jsx";
import {
  clearErrors,
  loadUser,
  updateProfile,
} from "../../actions/userAction.js";
import { useEffect } from "react";

const Shipping = ({ history }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [address, setAddress] = useState(user.address);

  const [stateCode, setStateCode] = useState(user.stateCode);
  const [countryCode, setCountryCode] = useState(user.countryCode);
  // eslint-disable-next-line
  const [phoneNo, setPhoneNo] = useState(user.phoneNo);

  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length < 10 || phoneNo.length > 11) {
      toast.error("Phone Number should be 10 to 11 digits");
      return;
    }
    if (
      address !== user.address ||
      stateCode !== user.stateCode ||
      countryCode !== user.countryCode ||
      phoneNo ||
      user.phoneNo
    ) {
      const myForm = new FormData();
      myForm.set("address", address);
      myForm.set("stateCode", stateCode);
      myForm.set("countryCode", countryCode);
      myForm.set("phoneNo", phoneNo);
      dispatch(updateProfile(myForm));
    } else {
      history.push("/order/confirm");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isUpdated) {
      dispatch(loadUser());
      history.push("/order/confirm");
      dispatch({
        type: UPDATE_PROFILE_RESET,
      });
    }
  }, [dispatch, error, history, isUpdated]);
  return (
    <>
      <MetaData title="Shipping Details" />
      <Header />
      <CheckoutSteps activeStep={0} />

      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>

          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >
            <div>
              <HomeIcon />
              <input
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <PhoneIcon />
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                size="10"
              />
            </div>

            <div>
              <PublicIcon />
              <select
                required
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
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
            )}

            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
              disabled={stateCode ? false : true}
            />
          </form>
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

export default Shipping;
