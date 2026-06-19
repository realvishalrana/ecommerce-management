import Product from "../models/productModel.js";

const createProduct = async (req, res, next) => {
  try {
    const validatedBody = req.validatedBody;

    const checkNameExits = await Product.findOne({ name: validatedBody.name });

    if (checkNameExits) {
      res.status(403).send({
        success: true,
        message: "Product Name is already Exits",
      });
      return;
    }

    const createProductData = await Product.create({
      ...validatedBody,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    res.status(201).send({
      success: true,
      data: createProductData,
    });
  } catch (error) {
    next(error);
  }
};

/* 
const getProducts = async (req, res, next) => {
  try {
    let { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { slug: { $regex: search, $options: "i" } },
        ],
      };
    }

    // // 1. Add .lean() to the end of your query
    // let productData = await Product.find(query)
    //   .populate("createdBy", "firstName lastName email")
    //   .populate("updatedBy", "firstName lastName email")
    //   .lean();

    // // 2. Loop through the products and manually attach the fullName
    // productData = productData.map((product) => {
    //   if (product.createdBy) {
    //     product.createdBy.fullName = `${product.createdBy.firstName} ${product.createdBy.lastName}`;
    //   }

    //   if (product.updatedBy) {
    //     product.updatedBy.fullName = `${product.updatedBy.firstName} ${product.updatedBy.lastName}`;
    //   }

    //   return product;
    // });

    res.send({
      success: true,
      data: productData,
    });
  } catch (error) {
    next(error);
  }
};
*/

const getProducts = async (req, res, next) => {
  try {
    let { search, nextCursor, limit = 10 } = req.query;

    let query = {};

    if (nextCursor) {
      query._id = { $lt: nextCursor };
    }

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { slug: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Mongoose will automatically attach 'fullName' to this user object!
    const productData = await Product.find(query)
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email")
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    // 4. Calculate the Metadata Payload
    let hasNextPage = false;
    let newNextCursor = null;

    if (productData.length > limit) {
      ((hasNextPage = true), productData.pop());

      newNextCursor = productData[productData.length - 1]._id;
    }

    res.send({
      success: true,
      data: products,
      metadata: {
        hasNextPage: hasNextPage,
        nextCursor: newNextCursor,
      },
    });
  } catch (error) {
    next(error);
  }
};

const editProducts = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.validatedBody,
        updatedBy: req.user.id,
      },
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      res.status(404).send({
        success: false,
        message: "No Product Found",
      });
      return;
    }

    res.status(200).send({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProducts = async (req, res, next) => {
  try {
    const deleteResult = await Product.deleteOne({ _id: req.params.id });

    if (deleteResult.deletedCount === 0) {
      res.status(404).send({
        success: false,
        message: "No Product Found",
      });
      return;
    }

    res.status(200).send({
      success: true,
      message: "Product Delete Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { createProduct, getProducts, editProducts, deleteProducts };
