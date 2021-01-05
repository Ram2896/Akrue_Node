// const mongoose = require("mongoose");
// const schema = mongoose.Schema;
// const { ObjectId } = mongoose.Schema;

// const CartItemSchema = new mongoose.Schema(
//   {
//     product: { type: ObjectId, ref: "Product" },
//     name: String,
//     price: Number,
//     count: Number,
//   },
//   {
//     timestamps: true,
//   }
// );

// const CartItem = mongoose.model("CartItemSchema", CartItemSchema);

// const OrderSchema = new mongoose.Schema(
//   {
//     products: [CartItemSchema],
//     transaction_id: {},
//     amount: { type: Number },
//     address: String,
//     status: {
//       type: String,
//       default: "Not Processed",
//       enum: [
//         "Not Processed",
//         "Processing",
//         "Shipped",
//         "Deliverry",
//         "Cancelled",
//       ],
//     },
//     Updated: Date,
//     user: { type: ObjectId, ref: "user" },
//   },
//   { timestamps: true }
// );

// const Order = mongoose.model("Order", OrderSchema);

// module.exports = { Order, CartItem };
