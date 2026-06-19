const validate = (Schema) => (req, res, next) => {
  const result = Schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.reduce((acc, issue) => {
      acc[issue.path.join(".")] = issue.message;
      return acc;
    }, {});
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }
  req.validatedBody = result.data;
  next();
};

export default validate;
