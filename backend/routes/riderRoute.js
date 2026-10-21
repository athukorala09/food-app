import express from "express";
import { registerRider, loginRider } from "../controllers/riderController.js"; 

const riderRouter = express.Router();

riderRouter.post("/register", registerRider);
riderRouter.post("/login", loginRider); 

export default riderRouter;