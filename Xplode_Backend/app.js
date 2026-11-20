const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env")
});

const { Server } = require("socket.io");
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
const friendsRouter = require("./routes/friends");
const chatRouter = require("./routes/chat");
const setupSocket = require("./config/socket");
const passport = require("passport");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);

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

// ——— Socket.IO ———
const io = new Server(server, { cors: corsOptions });
app.set("io", io);  // make io accessible in routes via req.app.get("io")
setupSocket(io);

require("./config/db");
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

app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/games", gamesRouter);
app.use("/api/vault", vaultRouter);
app.use("/api/library", libraryRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/reactions", likeDislikeRouter);
app.use("/api/community", communityRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/chat", chatRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
