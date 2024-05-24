import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/auth.route.js";
import gigRouter from "./routes/gig.route.js";
import reviewRouter from "./routes/review.route.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

// env dosyasındaki veriler erişmek
dotenv.config();

// veritabanı ile bağlantı
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Veritabanı ile bağlantı kuruldu"))
  .catch((err) =>
    console.log("Veritabanı ile bağlantı kurulurken bir HATA oluştu", err)
  );

// express uygulması
const app = express();

// middlewares

app.use(express.json());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(morgan("dev"));

app.use(cookieParser());

//* route tanımlama
app.use("/api/auth", authRouter);
app.use("/api/gig", gigRouter);
app.use("/api/review", reviewRouter);

// controllerlardan yapılcak tüm yönelndiröeler bu middleware'i tetikler
app.use((err, req, res, next) => {
  console.log("HATA MEYDANA GELDİ");
  console.log(err);

  const errStatus = err.status || 500;
  const errMessage = err.message || "Üzgünüz bir şeyler ters gitti";

  return res.status(errStatus).json({
    statusCode: errStatus,
    message: errMessage,
  });
});

// hangi portun dinlenicek
app.listen(process.env.PORT, () => {
  console.log(`API ${process.env.PORT} portu dinlemeye başladı`);
});
