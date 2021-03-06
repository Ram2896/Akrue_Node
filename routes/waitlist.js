const express = require("express");
const router = express.Router();

// const {
//   // create,
//   productById,
//   read,
//   remove,
//   update,
//   list,
//   listRelated,
//   listCategories,
//   listBySearch,
//   photo,
//   listSearch,
// } = require("../controllers/product");
const {
  welcome,
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo,
  listSearch,
  mailus,
} = require("../controllers/waitlist");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

// router.get("/product/:productId", read);
// router.delete(
  //   "/product/:productId/:userId",
//   requireSignin,
//   isAuth,
//   isAdmin,
//   remove
// );
// router.put(
  //   "/product/:productId/:userId",
  //   requireSignin,
  //   isAuth,
  //   isAdmin,
  //   update
  // );
  
  router.get("/welcome",  welcome);
  router.post("/waitlist/create", create);
  router.get("/waitlists/:userId", requireSignin, isAuth, isAdmin, list);
  router.post("/contactus", mailus)
  // router.get("/waitlists/:userId", list);
  
// router.get("/products/search", listSearch);
// router.get("/products/related/:productId", listRelated);
// router.get("/products/categories", listCategories);
// router.post("/products/by/search", listBySearch);
// router.get("/product/photo/:productId", photo);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
