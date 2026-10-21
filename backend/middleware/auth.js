import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    // 1. more explanation about how token get
    const token = req.headers.token;

    // 2. not token directly reject
    if (!token) {
        return res.json({ success: false, message: "Not Authorized, Login Again" });
    }

    try {
        // 3. verify the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Decode token after get userId enter the request 
        req.body.userId = token_decode.id;
        
        next(); // go next step
    } catch (error) {
        console.log("JWT Verification Error:", error.message);
        res.json({ success: false, message: "Invalid Token, Login Again" });
    }
};

export default authMiddleware;