import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
    const authorization = req.header("Authorization");
    const [scheme, token] = authorization?.split(" ") || [];

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Authentication required." });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token is not valid." });
    }
};

export default verifyJWT;
