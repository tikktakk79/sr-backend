const jwt = require("jsonwebtoken");

const authenticateTokenWhilePending = (req, res, next) => {
    const token = req.session.token;

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            res.sendStatus(401);
        } else {
            req.userId = user.userId;
            req.userRole = user.userRole;
            req.userStatus = user.userStatus;

            next();
        }
    });
};

export default authenticateTokenWhilePending
