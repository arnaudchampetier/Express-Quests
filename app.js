require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5006;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};
const userHandlers = require("./userHandlers");

const { hashPassword, verifyPassword, verifyToken } = require("./auth");

const movieHandlers = require("./movieHandlers");
/* const validateHandlers = require("./validateHandlers");
 */

// the public routes
app.get("/", welcome);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", movieHandlers.getUsers);
app.get("/api/users/:id", movieHandlers.getUserById);
app.post("/api/users", hashPassword, movieHandlers.postUser);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

// then the routes to protect

app.use(verifyToken); // authentication wall : verifyToken is activated for each route after this line

app.post("/api/movies", verifyToken, movieHandlers.postMovie);

app.put("/api/movies/:id", movieHandlers.putMovies);
app.put("/api/users/:id", movieHandlers.putUsers);

app.delete("/api/movies/:id", movieHandlers.deleteMovies);
app.delete("/api/users/:id", movieHandlers.deleteUsers);

// ...

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
