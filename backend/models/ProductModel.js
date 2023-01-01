const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name of a product"],
      trim: true,
      maxLength: [54, "Product name not exceed than 54 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description of your product"],
      maxlength: [4000, "Description is can not exceed than 4000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price for your product"],
      maxLength: [8, "Price can not exceed than 8 characters"],
    },
    offerPrice: {
      type: Number,
      maxLength: [8, "Discount price can not exceed than 8 characters"],
    },
    color: {
      type: String,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Please add a category of your product"],
    },
    subCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
      required: [true, "Please add a subcategory of your product"],
    },
    person: {
        type: String,
        default: "everyone"
    },
    size: [
      {
        name: {
          type: String,
          require:[true, "Please enter your size name"]
        },
        stock: {
          type :Number,
          require: [ true, "Please add some stoke for this size"],
          maxLength: [3, "Stock can not exceed than 3 characters"],
        }
      }
    ],
    stock: {
      type: Number,
      required: [true, "Please add some stoke for your product"],
      maxLength: [3, "Stock can not exceed than 3 characters"],
    },
    numOfReviews: {
      fiveStar: {
        type:Number,
        default:0
      },
      fourStar: {
        type:Number,
        default:0
      },
      threeStar: {
        type:Number,
        default:0
      },
      twoStar: {
        type:Number,
        default:0
      }
      ,oneStar: {
        type:Number,
        default:0
      },
      total: {
        type: Number,
        default:0
      }
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        avatar: {
          type: String,
          require: true
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
        },
        time: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    state: {
      type: Number,
      default:1
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      //   required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
