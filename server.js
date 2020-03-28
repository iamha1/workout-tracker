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

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

// Routes here
app.get("/", (req,res) => {
    res.sendFile("index.html");
});

app.get("/exercise", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/exercise.html"));
  });

app.get("/stats", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/stats.html"));
  });

app.get("/api/workouts", (req,res) => {
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

app.put("/api/workouts/:id", ({body, params}, res) => {
    db.Workout.findByIdAndUpdate(
        params.id,
        { $push: { exercises: body } },
        { new: true, runValidators: true }
        )
        .then(dbWorkout => {
            res.json(dbWorkout);
          })
          .catch(err => {
            res.json(err);
          });    
});

app.get("/api/workouts/range", ({query}, res) => {
db.Workout.find({})
.then(dbworkouts => {
    res.json(dbworkouts);
})
.catch(err => {
    res.json(err);
});
});

// app.delete("/api/workouts", ({ body }, res) => {
//     db.Workout.findByIdAndDelete(body.id)
//       .then(() => {
//         res.json(true);
//       })
//       .catch(err => {
//         res.json(err);
//       });
//   });


// app.get("/exercise/:lastWorkout", (req,res) => 
// { console.log(req.params.lastWorkout);
    
// })
        


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });


