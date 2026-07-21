import express from "express";
import { registerRider, loginRider } from "../controllers/riderController.js"; // loginRider එකත් මෙතනට import කරන්න

const riderRouter = express.Router();

riderRouter.post("/register", registerRider);
riderRouter.post("/login", loginRider); // මේ පේළිය අනිවාර්යයෙන්ම අවශ්‍යයි!

export default riderRouter;