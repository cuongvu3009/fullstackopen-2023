const Entry = require("./models/Entry.js");
const connectDB = require("./db/connect");
const cors = require("cors");
const env = require("dotenv");
const express = require("express");
const morgan = require("morgan");

env.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

// Routes
app.get("/api/persons", (req, res, next) => {
  Entry.find({})
    .then((response) => {
      res.json(response);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Entry.findById(req.params.id)
    .then((response) => {
      if (response) {
        res.json(response);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  Entry.findByIdAndUpdate(req.params.id, { number: req.body.number })
    .then(() => {
      Entry.findById(req.params.id)
        .then((response) => res.json(response))
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Entry.deleteOne({ _id: req.params.id })
    .then((response) => {
      console.log(response);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    res.status(400).json({
      error: "Name and/or Number is missing",
    });
  } else {
    const newPerson = new Entry({
      name: req.body.name,
      number: req.body.number,
    });

    newPerson
      .save()
      .then((savedEntry) => {
        res.json(savedEntry);
      })
      .catch((error) => next(error));
  }
});

app.get("/info", (req, res, next) => {
  Entry.find({})
    .then((response) => {
      const date = new Date(Date.now());
      res.send(
        `Phonebook has info for ${
          response.length
        } people <br/> ${date.toString()}`
      );
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

// Start server
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
start();
