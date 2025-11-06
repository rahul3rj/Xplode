const express = require("express");
const cors = require("cors");
const indexRouter = require("./routes/indexRoute");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const gamesRouter = require("./routes/games");
const vaultRouter = require("./routes/vault");
const profileRouter = require("./routes/profile");
const libraryRouter = require("./routes/library");
const favoriteRouter = require("./routes/favorites");
const likeDislikeRouter = require("./routes/likeDislikeRoutes");
const communityRouter = require("./routes/community");
const passport = require("passport");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN.split(",");
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
   methods: "GET,POST,PUT,DELETE",
};
app.use(cors(corsOptions));


require("./config/db");
require("dotenv").config();
require("./config/google_oauth_config");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());


app.use("/" , indexRouter)
app.use("/auth" , authRouter)
app.use("/user" , userRouter)
app.use("/profile" , profileRouter)
app.use("/games" , gamesRouter)
app.use("/vault", vaultRouter);
app.use("/library", libraryRouter);
app.use("/favorite", favoriteRouter);
app.use("/reaction", likeDislikeRouter);
app.use("/community", communityRouter);




app.listen(5000 || process.env.PORT);
