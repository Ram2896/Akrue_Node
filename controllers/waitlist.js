const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Waitlist = require("../models/waitlist");
const { errorHandler } = require("../helpers/dbErrorHandler");
const { constants } = require("buffer");
const sendEmail = require("../helpers/email");

exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

exports.welcome = (req, res) => {
  return res.json("Welcome");
};


exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};


exports.create = (req, res) => {
  // Check for all fields
  const {
    firstName,
    lastName,
    university,
    graduatingYear,
    sport,
    gender,
    instaUsername,
    refererEmail,
    userEmail,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !university ||
    !graduatingYear ||
    !sport ||
    !gender ||
    !instaUsername ||
    !refererEmail ||
    !userEmail
  ) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  let waitlist = new Waitlist({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    university : req.body.university,
    graduatingYear: req.body.graduatingYear,
    sport: req.body.sport,
    gender: req.body.gender,
    instaUsername : req.body.instaUsername,
    refererEmail: req.body.refererEmail,
    userEmail: req.body.userEmail,
  });
  
  waitlist.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    // res.json(result);
    res.json('Sucessfully added')
    sendEmail({
      email: "ramachari2896@gmail.com",
      subject: "Welcome to Akrue Joinlist",
      message: `<table style="border-collapse:collapse;width: 70%; margin: auto;">
      <tr>
        <th colspan="2" style=" border: 1px solid #dddddd;text-align: left; padding: 8px;text-align: center">${waitlist.firstName} ${waitlist.lastName}</th>
    
      </tr>
      <tr>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px; background-color: #dddddd;">Email</td>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px;">${waitlist.userEmail}</td>
      </tr>
      <tr>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px; background-color: #dddddd;">University </td>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px;">${waitlist.university}</td>
      </tr>
      <tr>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px; background-color: #dddddd;">Graduating Year </td>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px;">${waitlist.graduatingYear}</td>
      </tr>
      <tr>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px; background-color: #dddddd;"> Sport </td>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px;">${waitlist.sport}</td>
      </tr>
      <tr>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px; background-color: #dddddd;"> Gender </td>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px;"> ${waitlist.gender}</td>
      </tr>
      <tr>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px; background-color: #dddddd;"> Insta Username </td>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px;"> ${waitlist.instaUsername}</td>
      </tr>
      <tr>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px; background-color: #dddddd;"> refererEmail </td>
        <td style=" border: 1px solid #dddddd;text-align: center; padding: 8px;"> ${waitlist.refererEmail} </td>
      </tr>
    
    </table>`
      // messagec: `Email: ${waitlist.userEmail}, Name: ${waitlist.firstName} , Last Name: ${waitlist.lastName}, University : ${waitlist.university},
      // Graduating Year: ${waitlist.graduatingYear}, Sport: ${waitlist.sport} , Gender: ${waitlist.gender} ,
      // Insta Username : ${waitlist.instaUsername}, refererEmail: ${waitlist.refererEmail} `,
    });
  });
};

// exports.create = (req, res) => {
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;
//     // console.log(form);
//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         return res.status(400).json({
//           error: "Images could not be uploaded",
//         });
//       }
//       // Check for all fields
//       const { name, description } = fields;

//       console.log(name , email);

//       if (
//         !name ||
//         !email
//       ) {
//         return res.status(400).json({
//           error: "All fields are required",
//         });
//       }

//       res.json(fields);

//       // let product = new Product(fields);
//       // 1kb = 1000
//       // 1mb= 1000000

//       // if (files.photo) {
//       //   if (files.photo.size > 1000000) {
//       //     return res.status(400).json({
//       //       error: "Images Should be less than 1 mb iin size",
//       //     });
//       //   }
//       //   product.photo.data = fs.readFileSync(files.photo.path);
//       //   product.photo.contentType = files.photo.type;
//       //   console.log("files Photo", product.photo.data);
//       // }

//       // product.save((err, result) => {
//       //   if (err) {
//       //     return res.status(400).json({
//       //       error: errorHandler(err),
//       //     });
//       //   }

//       //   res.json(result);
//       // });
//     });

// };

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      // deletedProduct,
      message: "Product deleted successfully!",
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Images could not be uploaded",
      });
    }

    // Check for all fields
    // const { name, description, price, category, quantity, shipping } = fields;

    // if (
    //   !name ||
    //   !description ||
    //   !price ||
    //   !category ||
    //   !quantity ||
    //   !shipping
    // ) {
    //   return res.status(400).json({
    //     error: "All fields are required",
    //   });
    // }

    let product = req.product;
    product = _.extend(product, fields);
    // 1kb = 1000
    // 1mb= 1000000

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Images Should be less than 1 mb iin size",
        });
      }
      // console.log("files Photo", files.photo);
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }

      res.json(result);
    });
  });
};

exports.list = (req, res) => {
  // console.log("inside list");
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100000;
  Waitlist.find()
    // // .populate("category")
    // .select()
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, waitlist) => {
      if (err) {
        return res.status(400).json({
          error: "No users in waitlist",
        });
      }

      res.json(waitlist);
    });
};

exports.mailus =(req, res) => {
  const {
  name,email,message
  } = req.body;
  res.json('Sucessfully Sent')
  sendEmail({
    email: "balaji@handwtech.com",
    subject: `${name}. email: ${email} contactus form`,
    message: `${message}`,
  });
}
// It will find product based on the request product category
//  Other product that has the same category will be returned
exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id, name")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found",
        });
      }

      res.json(products);
    });
};

exports.listCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "Categories not found",
      });
    }
    res.json(categories);
  });
};

exports.listBySearch = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("Findargs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte - greater than price [0-10]
        // lte - less than

        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.listSearch = (req, res) => {
  //create query boject to hold search value and category balur
  const query = {};
  //Assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
    // assign category value to query.category
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
      // find product based on query object with 2 properties
      // search and category
    }
    Product.find(query, (err, product) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(product);
    }).select("-photo");
  }
};

exports.decreaseQuantity = (req, res, next) => {
  // console.log(req.body);
  let bulkOpt = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  Product.bulkWrite(bulkOpt, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: "Could not update product",
      });
    }
    next();
  });
};
