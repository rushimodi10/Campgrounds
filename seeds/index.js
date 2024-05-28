import mongoose from "mongoose";
import cities from "./cities.js";
import { places, descriptors } from "./seedHelpers.js";
import Campground from "../models/campground.js";

const { connect, connection } = mongoose;

connect("mongodb://localhost:27017/camp-db", {
  useNewUrlParser: true,
//   useCreateIndex: true,
  useUnifiedTopology: true
});

const db = connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) +10;
        const camp = new Campground({
          author: '6654218a45661008d3be9fec',
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          image: "https://source.unsplash.com/collection/483251",
          description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis magnam numquam temporibus asperiores eum deserunt! Doloremque, autem maiores. Quae fugit sequi neque quibusdam aspernatur nesciunt enim nulla obcaecati, voluptate quos!",
          price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    connection.close();
});