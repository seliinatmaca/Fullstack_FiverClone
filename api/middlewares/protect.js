import error from "../utils/error.js";
import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const token = req.cookies.accessToken;

  console.log("ÇEREZLER", req.cookies);

  if (!token) return next(error(403, "Yetkiniz yok (Token Bulunamadı)"));

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return next(error(403, "Tokeniniz geçersiz veya süresi dolmuş"));

    req.userId = payload.id;
    req.isSeller = payload.isSeller;
  });

  next();
};

export default protect;
