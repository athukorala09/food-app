import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    // 1. ටෝකනය ලබා ගන්නා ක්‍රමය වඩාත් පැහැදිලි කිරීම
    const token = req.headers.token;

    // 2. ටෝකනයක් නැත්නම් කෙලින්ම ප්‍රතික්ෂේප කරන්න
    if (!token) {
        return res.json({ success: false, message: "Not Authorized, Login Again" });
    }

    try {
        // 3. ටෝකනය Verify කිරීම
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Decode වූ ටෝකනයෙන් userId ලබාගෙන request එකට ඇතුල් කිරීම
        req.body.userId = token_decode.id;
        
        next(); // ඊළඟ ක්‍රියාවලියට යන්න
    } catch (error) {
        console.log("JWT Verification Error:", error.message);
        res.json({ success: false, message: "Invalid Token, Login Again" });
    }
};

export default authMiddleware;