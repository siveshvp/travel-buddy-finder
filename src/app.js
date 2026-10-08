const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });

// Schema
const travelSchema = new mongoose.Schema({
    name: String,
    destination: String,
    travelDate: String,
    travelMode: String
});

// Model
const Travel = mongoose.model("Travel", travelSchema);

// Display HTML page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Save travel details
app.post("/travel", async (req, res) => {

    console.log("POST /travel received");
    console.log(req.body);

    try {

        const travel = new Travel({
            name: req.body.name,
            destination: req.body.destination,
            travelDate: req.body.travelDate,
            travelMode: req.body.travelMode
        });

        await travel.save();

        res.send(`
            <h2>Travel Details Saved Successfully!</h2>

            <p>Name: ${req.body.name}</p>
            <p>Destination: ${req.body.destination}</p>
            <p>Travel Date: ${req.body.travelDate}</p>
            <p>Travel Mode: ${req.body.travelMode}</p>

            <br>

            <a href="/">Add Another Traveller</a>
        `);

    } catch (error) {

        console.log("Error saving travel details:", error);

        res.status(500).send("Error saving travel details");
    }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
