import foodModel from "../models/foodModel.js";
import fs from 'fs';

// add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category || "Not come", 
        image: image_filename
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food Added Successfully!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// all food list
const listFood = async(req,res)=>{
    try{
        const food = await foodModel.find({});
        res.json({success:true,data:food});
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}


const addFoodList = async (req, res) => {
    try {
     
        const existingFoodsCount = await foodModel.countDocuments({});

        
        if (existingFoodsCount > 0) {
            return res.json({ 
                success: false, 
                message: "Data already inserted! Blocking duplicate upload." 
            });
        }

        
        await foodModel.insertMany(req.body.food_list); 
        res.json({ success: true, message: "All food added successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}


const removeFood = async(req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"food removed"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error"});
    }
}

export { addFood, listFood, addFoodList, removeFood };