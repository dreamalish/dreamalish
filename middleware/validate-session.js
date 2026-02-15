require('dotenv').config();
const jwt = require('jsonwebtoken');
const { userModel } = require('../db-associations');

module.exports = async (req, res, next) => {
    try {
        // Allow preflight OPTIONS requests through
        if (req.method === 'OPTIONS') return next();

        let sessionToken = req.headers.authorization;

        if (!sessionToken) {
            return res.status(403).json({ auth: false, message: "No token provided." });
        }

        // Handle "Bearer <token>" format
        if (sessionToken.startsWith("Bearer ")) {
            sessionToken = sessionToken.slice(7, sessionToken.length);
        }

        console.log("Token received:", sessionToken);

        jwt.verify(sessionToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.error("JWT verify error:", err);
                return res.status(401).json({ error: "Not authorized", code: "badToken" });
            }

            try {
                const user = await userModel.findOne({ where: { id: decoded.id } });

                if (!user) {
                    return res.status(401).json({ error: "Not authorized", code: "badToken" });
                }

                req.user = user;
                next();
            } catch (dbErr) {
                console.error("Database error in validate-session:", dbErr);
                return res.status(500).json({ error: "Server error validating session" });
            }
        });
    } catch (e) {
        console.error("Unexpected error in validate-session:", e);
        return res.status(500).json({ error: "Server error validating session" });
    }
};
