import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DuplicateRequestError, UnAuthorizedError } from "../utils/appError.js";

const getUser = async (req, res, next) => {
  try {
    // 1. Extract and force pagination queries into strict Numbers
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { search, startDate, endDate } = req.query;

    let query = {};

    // 2. Search logic
    if (search) {
      // Best practice: attach $or to the query rather than replacing it
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 3. Date logic
    if (startDate || endDate) {
      query.DOB = {};
      if (startDate) query.DOB.$gte = new Date(startDate);
      if (endDate) query.DOB.$lte = new Date(endDate);
    }

    // 4. Calculate the skip
    const skipAmount = (page - 1) * limit;

    // 5. Execute BOTH queries at the exact same time for maximum speed
    const [userList, totalRecord] = await Promise.all([
      User.find(query).skip(skipAmount).limit(limit).lean(), // Added lean()!
      User.countDocuments(query), // Passed the query to count!
    ]);

    // 6. Send response with structured metadata
    res.send({
      success: true,
      data: userList,
      metadata: {
        // Grouping pagination data into 'metadata' is a great API practice
        totalRecord: totalRecord,
        currentPage: page,
        limit: limit,
        totalPages: Math.ceil(totalRecord / limit), // Fixed the math!
      },
    });
  } catch (error) {
    next(error);
  }
};
const createUser = async (req, res, next) => {
  try {
    const data = req.validatedBody;

    const user = await User.findOne({ email: data.email });

    if (user) {
      throw new DuplicateRequestError("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = await User.create({
      ...data,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new UnAuthorizedError("Email does not exist");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw new UnAuthorizedError("Password is incorrect");
    }

    const jwtPayload = {
      _id: String(user._id),
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.email,
      role: user.role,
      isAdmin: user.role === USER_ROLE.ADMIN,
    };

    const genereateToken = jwt.sign(
      {
        user: jwtPayload,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.status(201).json({
      success: true,
      token: genereateToken,
    });
  } catch (error) {
    next(error);
  }
};

export { getUser, createUser, loginUser };
