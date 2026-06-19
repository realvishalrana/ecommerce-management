import jwt from "jsonwebtoken";

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authorization token required",
    });
    return;
  }

  try {
    let token = authHeader.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decodedUserData = decoded.user;
    const userId = decodedUserData._id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization token structure",
      });
      return;
    }

    req.user = {
      id: userId,
      email: decodedUserData.email,
      isAdmin: decodedUserData.role === "admin" ? true : false,
      role: decodedUserData.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleWare;
