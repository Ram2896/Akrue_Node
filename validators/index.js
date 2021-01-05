exports.userSignupValidator = (req, res, next) => {
  req.check("name", "name is required");
  req
    .check("email", "Email must br between 3 to 32")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contains @")
    .isLength({
      min: 4,
      max: 32,
    });
  req.check("password", "password is required").notEmpty();
  req
    .check("password")
    .isLength({
      min: 6,
    })
    .withMessage("password must contin atleast 6 characters")
    .matches(/\d/)
    .withMessage("password must contain a number");
  const errors = req.validationErrors();
  if (errors) {
    console.log("Inside error");
    const firstErrors = errors.map((error) => error.msg);
    return res.status(400).json({ error: firstErrors });
  }
  next();
};
