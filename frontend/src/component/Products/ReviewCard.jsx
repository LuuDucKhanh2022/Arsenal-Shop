import React from "react";
import { useSelector } from "react-redux";
import { Rating } from "@material-ui/lab";
import Loading from "../../more/Loader";
import clsx from "clsx";
import styles from "./ReviewCard.module.css";

const ReviewCard = ({ review }) => {
  // eslint-disable-next-line

  const { loading } = useSelector((state) => state.productDetails);
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
    color: "#3BB77E",
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className={clsx(styles.reviewCard)}>
          <div className={clsx(styles.heading)}>
            <div className={clsx(styles.headingLeft)}>
              <div className={clsx(styles.avatar)}>
                <img src={review.avatar} alt="" />
              </div>
              <div>
                <p className={clsx(styles.name)}>{review.name}</p>
                {/* <Rating {...options} /> */}
                <Rating name="read-only" value={review.rating} readOnly />
              </div>
            </div>
            <p className={clsx(styles.date)}>
              {String(review.time).substr(0, 10)}
            </p>
          </div>
          <div className={clsx(styles.review)}>
            <p className={clsx(styles.content)}>{review.comment}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewCard;
