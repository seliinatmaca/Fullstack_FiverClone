import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import error from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const hashedPass = bcrypt.hashSync(req.body.password, 5);

    const newUser = new User({ ...req.body, password: hashedPass });

    await newUser.save();

    res.status(201).json({
      message: "Yeni kullanıcı oluşturuldu",
      user: newUser,
    });
  } catch (err) {
    next(error(400, "Hesap oluşturulurken bir hata meydabna geldi."));
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return next(error(404, "Kullanıcı bulunamadı"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);

    if (!isCorrect) return next(error(404, "Şifreniz yanlış"));

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    user.password = null;

    res.cookie("accessToken", token).status(200).json({
      message: "Hesaba giriş yapıldı",
      user,
    });
  } catch (err) {
    next(error(400, "Giriş yaparken bir sorun oluştu"));
  }
};

export const logout = async (req, res, next) => {
  res.clearCookie("accessToken").status(200).json({
    message: "Kullanıcı hesabından çıkış yaptı",
  });
};
