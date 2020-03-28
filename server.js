const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

const path = require("path");

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://workout-tracker-march2020:password1@ds255308.mlab.com:55308/heroku_gth9scw4", { useNewUrlParser: true });

// Routes here
app.get("/", (req, res) => {
    res.sendFile("index.html");
});

app.get("/exercise", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/exercise.html"));
});

app.get("/stats", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/stats.html"));
});

app.get("/api/workouts", (req, res) => {
    // console.log("workouts here");
    db.Workout.find({})
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
});

app.post("/api/workouts", (req, res) => {
    db.Workout.create({})
        .then(dbWorkout => {
            //console.log(dbWorkout);
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});

// app.put("/api/workouts/:id", ({body, params}, res) => {
//     db.Workout.findByIdAndUpdate(
//         params.id,
//         { $push: { exercises: body } },
//         { new: true, runValidators: true }
//         )
//         .then(dbWorkout => {
//             res.json(dbWorkout);
//           })
//           .catch(err => {
//             res.json(err);
//           });    
// });

app.put("/api/workouts/:id", (req, res) => {
    db.Workout.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: { exercises: req.body } }, function (err, data) {
        if (err)
            throw err;
        res.send(data)
    });
});

app.get("/api/workouts/range", ({ query }, res) => {
    db.Workout.find({})
        .then(dbworkouts => {
            res.json(dbworkouts);
        })
        .catch(err => {
            res.json(err);
        });
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});


