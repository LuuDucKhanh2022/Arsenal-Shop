import React, { useState } from "react";
import axios from "axios";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { newReview } from "../../actions/ProductActions";
import { Rating } from "@material-ui/lab";
import StarIcon from "@material-ui/icons/Star";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addItemsToCart } from "../../actions/CartAction";
import ReviewCard from "./ReviewCard.jsx";
import { NEW_REVIEW_RESET } from "../../constans/ProductConstans";
import ReactPaginate from "react-paginate";
import Loading from "../../more/Loader";
import styles from "./ReviewTab.module.css";
import { useEffect } from "react";

function Reviews({ currentReviews }) {
  return (
    <>
      {currentReviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </>
  );
}

const ReviewsTab = ({ product, match, history }) => {
  const numOfReviews = product.numOfReviews;
  const { isAuthenticated } = useSelector((state) => state.user);
  const { loading, success, error } = useSelector((state) => state.newReview);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState("all");

  const [reviews, setReviews] = useState([]);
  async function fetchData(reviewData) {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        `/api/v2/product/review`,
        reviewData,
        config
      );
      toast.success(data.message);
    } catch (err) {
      let message;
      typeof err.response.data === "string"
        ? (message = err.response.data.slice(
            err.response.data.lastIndexOf("Error") + 6,
            err.response.data.indexOf("<br>")
          ))
        : (message = err.response.data.message);
      toast.error(message);
    }
  }

  useEffect(() => {
    setSort("newest");
    setFilter("all");
  }, [product]);
  const reviewsPerPage = 5;
  const dispatch = useDispatch();
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [reviewOffset, setReviewOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = reviewOffset + reviewsPerPage;
  const currentReviews = reviews.slice(reviewOffset, endOffset);
  const pageCount = Math.ceil(reviews.length / reviewsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * reviewsPerPage) % reviews.length;
    setReviewOffset(newOffset);
  };

  useEffect(() => {
    let newReviews = [...product.reviews];
    switch (sort) {
      case "newest":
        newReviews = newReviews.reverse();
        break;
      case "oldest":
        break;
      case "highest":
        newReviews.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        newReviews.sort((a, b) => a.rating - b.rating);
        break;
      default:
    }

    switch (filter) {
      case "5 stars":
        setReviews(newReviews.filter((review) => review.rating === 5));
        break;
      case "4 stars":
        setReviews(newReviews.filter((review) => review.rating === 4));
        break;
      case "3 stars":
        setReviews(newReviews.filter((review) => review.rating === 3));
        break;
      case "2 stars":
        setReviews(newReviews.filter((review) => review.rating === 2));
        break;
      case "1 stars":
        setReviews(newReviews.filter((review) => review.rating === 1));
        break;
      default:
        setReviews(newReviews);
    }
  }, [filter, product.reviews, sort]);

  const reviewSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", match.params.id);

    isAuthenticated !== true ? history.push(`/login?redirect=/`) : <></>;

    fetchData(myForm);
    // dispatch(newReview(myForm));

    // comment.length === 0
    //   ? toast.error("Please fill the comment box")
    //   : toast.success("Review done successfully reload for watch it");

    // dispatch({ type: NEW_REVIEW_RESET });
  };

  useEffect(() => {
    if (success === false) {
      toast.error(error);
    }
  });
  return (
    <div className={clsx(styles.reviewTab)}>
      <div className={clsx(styles.header)}>
        <div className={clsx(styles.overview)}>
          <div className={clsx(styles.text)}>Average rating</div>
          <div className={clsx(styles.number)}>{product.ratings}/5</div>
          <Rating value={product.ratings} readOnly precision={0.5} />
          <span className={clsx(styles.numOfReviews)}>
            {numOfReviews.total} reviews
          </span>
        </div>
        <div className={clsx(styles.list)}>
          <div className={clsx(styles.item)}>
            <span className={clsx(styles.rating)}>5</span>
            <StarIcon className={clsx(styles.starIcon)} />
            <div className={clsx(styles.progressSuccess)}>
              <div
                className={clsx(styles.progressBar)}
                style={
                  numOfReviews.fiveStar !== 0
                    ? {
                        width: `${
                          (numOfReviews.fiveStar / numOfReviews.total) * 100
                        }%`,
                      }
                    : { width: 0 }
                }
              ></div>
            </div>
            <span className={clsx(styles.numOfReviews)}>
              {" "}
              {numOfReviews.fiveStar}
            </span>
          </div>
          <div className={clsx(styles.item)}>
            <span className={clsx(styles.rating)}>4</span>
            <StarIcon className={clsx(styles.starIcon)} />
            <div className={clsx(styles.progressSuccess)}>
              <div
                className={clsx(styles.progressBar)}
                style={
                  numOfReviews.fourStar !== 0
                    ? {
                        width: `${
                          (numOfReviews.fourStar / numOfReviews.total) * 100
                        }%`,
                      }
                    : { width: 0 }
                }
              ></div>
            </div>
            <span className={clsx(styles.numOfReviews)}>
              {numOfReviews.fourStar}
            </span>
          </div>
          <div className={clsx(styles.item)}>
            <span className={clsx(styles.rating)}>3</span>
            <StarIcon className={clsx(styles.starIcon)} />
            <div className={clsx(styles.progressSuccess)}>
              <div
                className={clsx(styles.progressBar)}
                style={
                  numOfReviews.threeStar !== 0
                    ? {
                        width: `${
                          (numOfReviews.threeStar / numOfReviews.total) * 100
                        }%`,
                      }
                    : { width: 0 }
                }
              ></div>
            </div>
            <span className={clsx(styles.numOfReviews)}>
              {numOfReviews.threeStar}
            </span>
          </div>
          <div className={clsx(styles.item)}>
            <span className={clsx(styles.rating)}>2</span>
            <StarIcon className={clsx(styles.starIcon)} />
            <div className={clsx(styles.progressSuccess)}>
              <div
                className={clsx(styles.progressBar)}
                style={
                  numOfReviews.twoStar !== 0
                    ? {
                        width: `${
                          (numOfReviews.twoStar / numOfReviews.total) * 100
                        }%`,
                      }
                    : { width: 0 }
                }
              ></div>
            </div>
            <span className={clsx(styles.numOfReviews)}>
              {numOfReviews.twoStar}
            </span>
          </div>
          <div className={clsx(styles.item)}>
            <span className={clsx(styles.rating)}>1</span>
            <StarIcon className={clsx(styles.starIcon)} />
            <div className={clsx(styles.progressSuccess)}>
              <div
                className={clsx(styles.progressBar)}
                style={
                  numOfReviews.oneStar !== 0
                    ? {
                        width: `${
                          (numOfReviews.oneStar / numOfReviews.total) * 100
                        }%`,
                      }
                    : { width: 0 }
                }
              ></div>
            </div>
            <span className={clsx(styles.numOfReviews)}>
              {numOfReviews.oneStar}
            </span>
          </div>
        </div>
      </div>
      <div className={clsx(styles.sort)}>
        <select
          value={filter}
          name="filter"
          id=""
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Rating</option>
          <option value="5 stars">5 stars</option>
          <option value="4 stars">4 stars</option>
          <option value="3 stars">3 stars</option>
          <option value="2 stars">2 stars</option>
          <option value="1 stars">1 stars</option>
        </select>

        <select
          value={sort}
          name="sort"
          id=""
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>
      {product.reviews && product.reviews[0] ? (
        <Reviews currentReviews={currentReviews} />
      ) : (
        <p className={clsx(styles.noReviews)}>No Reviews Yet *</p>
      )}

      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="pageItemActive"
        activeLinkClassName="pageLinkActive"
        renderOnZeroPageCount={null}
      />
      <div className={clsx(styles.addReviewBox)}>
        <span>Add a Review</span>
        <div className={clsx(styles.yourRating)}>
          <div>
            <span>Your Rating*</span>
            <Rating
              name="simple-controlled"
              onChange={(e) => setRating(parseInt(e.target.value))}
              value={rating}
              size="large"
            />
          </div>
        </div>
        <textarea
          cols="30"
          rows="6"
          placeholder="Comment *"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button type="submit" onClick={reviewSubmitHandler}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewsTab;
