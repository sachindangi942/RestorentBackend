const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const create_token = ({ data }) => {
    return jwt.sign(data, SECRET_KEY,{expiresIn:"5m"})
};
const check_token = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) res.status(401).send({ msg: "access denay" });
    else {
        jwt.verify(token, SECRET_KEY, (err) => {
            if (err) {
                res.status(401).send(err)
            } else {
                next();
            }
        })
    }
};


const getToken_data = ({headers}) => {
    const token = headers["authorization"]?.split(" ")[1];
    return decode = jwt.verify(token, SECRET_KEY)
}
module.exports = { create_token, check_token, getToken_data };