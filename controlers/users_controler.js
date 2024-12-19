const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const { create_token, getToken_data } = require("../Middleware/authMiddleware");
const { registration_val, login_val, add_product_val, forgot_password_val, reset_password_val, change_password_val } = require("../validation/validation");
const addProduct = require("../Models/add_product_schema");
const User_schema = require("../Models/schema");
const sendEmail = require("../Utils/sendEmail");
//______________________________________
const userSchema = require("../Models/User_schema");
//_______________________________________



//___________________________________________________MiddlwareuseControler_________________________________
const registration_control = async (req, res) => {
    try {
        let data = req.body;
        const hash_password = bcrypt.hashSync(data["password"], saltRounds)
        data["password"] = hash_password
        data["role"] = "admin"
        const newUser = new userSchema(data);
        const response = await newUser.save();
        res.send(response)
    } catch (error) {
        res.status(401).send(error.message)
    }
};



const login_control = async (req, res) => {
    try {
        const user_data = req.body;
        const db_data = await userSchema.findOne({ Email: user_data.Email } ?? { Mobile: user_data.Mobile });
        if (db_data?.password && db_data?.Email) {
            const { Email, _id, role } = db_data;
            const isMatch_password = bcrypt.compareSync(user_data.password, db_data["password"]);
            if (isMatch_password) {
                const data = { Email, _id, role }
                const token = create_token({ data },);
                return res.send({ token, msg: "login successfull" });
            }
        }
        res.status(401).send("invalid userName and password");
    } catch (error) {
        console.log(error)
        res.status(401).send(error.message)
    }
};

const change_password_controler = async (req, res) => {
    try {
        const { Email, newPassword } = req.body;
        const { error } = change_password_val({ data: req.body });
        if (error) return res.send(error.details[0].message)
        const User = await User_schema.findOne({ Email });
        if (!User) return res.send("invalide password");
        const hash_password = bcrypt.hashSync(newPassword, saltRounds);
        User.password = hash_password;
        await User.save();
        res.send("password successfully change")
    } catch (error) {
        res.send(error.message);
    }

};

const forgot_password_controler = async (req, res) => {
    try {
        // const { error } = forgot_password_val({ data: req.body });
        // if (error) return res.send(error.details[0].message);
        const User = await User_schema.findOne({ Email: req.body.Email });
        if (!User) return res.status(401).send("invalide user");
        const token = create_token({ data: req.body });
        User["resetPasswordToken"] = token;
        User["resetPasswordExpires"] = Date.now() + 10 * 60 * 1000;
        await User.save();
        // const resetLink = `http://localhost:7000/user/resetPassword/${token}`;
        const clickableLink = `<a href="http://localhost:7000/user/resetPassword/${token}">Reset your password</a>`
        await sendEmail(User.Email, "password reset", `<p>Click the following link to reset your password:</p>${clickableLink}`);
        res.send({ success: true, msg: "password reset link successfully send for Email" })

    } catch (error) {
        res.status(401).send(error.errmsg);
    }
};

//____________________________________________________________________________________
// const registration_control = async (req, res) => {
//     try {
//         let data = req.body;
//         const hash_password = bcrypt.hashSync(data["password"], saltRounds)
//         const { error } = registration_val({ data })
//         data["password"] = hash_password
//         if (error) return res.send(error.details.map(err => err.message));
//         data["role"] = "admin"
//         const newUser = new User_schema(data);
//         const response = await newUser.save();
//         res.send({ response })
//     } catch (error) {
//         res.status(401).send(error.message)
//     }
// };

// const login_control = async (req, res) => {
//     try {
//         const user_data = req.body;
//         const { error } = login_val({ data: user_data })
//         if (error) return res.status(401).send(error.details.map(err => err.message));
//         const db_data = await User_schema.findOne({ Email: user_data.Email } ?? { Mobile: user_data.Mobile });
//         if (db_data?.password && db_data?.Email) {
//             const isMatch_password = bcrypt.compareSync(user_data.password, db_data["password"]);
//             if (isMatch_password) {
//                 const token = create_token({ data: user_data },);
//                 return res.send({ token, msg: "login successfull" });
//             }
//         }
//         res.status(401).send("invalid userName and password");
//     } catch (error) {

//         res.status(401).send(error.message)
//     }
// };

// const change_password_controler = async (req, res) => {
//     try {
//         const { Email, newPassword } = req.body;
//         const { error } = change_password_val({ data: req.body });
//         if (error) return res.send(error.details[0].message)
//         const User = await User_schema.findOne({ Email });
//         if (!User) return res.send("invalide password");
//         const hash_password = bcrypt.hashSync(newPassword, saltRounds);
//         User.password = hash_password;
//         await User.save();
//         res.send("password successfully change")
//     } catch (error) {
//         res.send(error.message);
//     }

// }

// const forgot_password_controler = async (req, res) => {
//     try {
//         const { error } = forgot_password_val({ data: req.body });
//         if (error) return res.send(error.details[0].message);
//         const User = await User_schema.findOne({ Email: req.body.email });
//         if (!User) return res.send("invalide user");
//         const token = create_token({ data: req.body });
//         User["resetPasswordToken"] = token;
//         User["resetPasswordExpires"] = Date.now() + 10 * 60 * 1000;
//         await User.save();
//         // const resetLink = `http://localhost:7000/user/resetPassword/${token}`;
//         const clickableLink = `<a href="http://localhost:7000/user/resetPassword/${token}">Reset your password</a>`
//         await sendEmail(User.Email, "password reset", `<p>Click the following link to reset your password:</p>${clickableLink}`);
//         res.send({ success: true, msg: "password reset link successfully send for Email" })

//     } catch (error) {
//         res.send(error.errmsg);
//     }
// };

const reset_password_controler = async (req, res) => {

    try {
        const { error } = reset_password_val({ data: req.body });
        if (error) return res.send(error.details[0].message);
        const decode = jwt.verify(req.query.resetPasswordToken, process.env.SECRET_KEY);
        const User = await User_schema.findOne({
            Email: decode.email,
            resetPasswordToken: req.query.resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        })
        if (!User) return res.send({ msg: "invalide token" });
        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        User["password"] = hashPassword;
        User.resetPasswordExpires = undefined;
        User.resetPasswordToken = undefined;
        res.send({ success: true, msg: "password successfully reset", token: req.query });

        await User.save();
    } catch (error) {
        res.send({ err: error.message });
    }
};

const add_product_control = async (req, res) => {
    try {
        const product = req.body;
        const { error } = add_product_val({ data: product });
        if (error) return res.status(401).send(error.details[0].message);
        const newAdd_product = new addProduct(product);
        const response = await newAdd_product.save();
        res.status(200).send(response);
    } catch (error) {
        res.status(401).send(error.errmsg)
    }
};

const fetch_product_controler = async (req, res) => {
    try {
        const { code } = req.body;
        if (code) {
            const product_datails = await addProduct.findOne({ code });
            if (!product_datails) return res.send("product not found");
            return res.send(product_datails);
        }
        const produnct_list = await addProduct.find();
        if (!produnct_list) return res.send("product not found");
        res.send(produnct_list);
    } catch (error) {
        res.status(401).send(error.message)
    }

};

const update_product_controler = async (req, res) => {
    try {
        const data = req.body;
        if (!data.code) return res.send("please enter iteam code");
        const update_product = await addProduct.updateOne({ code: data.code }, { $set: data });
        if (update_product.matchedCount === 0) return res.send("No product found with the given code");
        if (update_product.modifiedCount === 0) return res.send("Product found, but no changes were made");
        res.send(update_product);
    } catch (error) {
        res.send({ msg: error.message });
    }

};

const delete_product_controler = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.send("enter iteam code");
        const deleteProduct = await addProduct.deleteOne({ code });
        if (deleteProduct.deletedCount === 0) return res.send("No product found with given iteam code");
        res.send({ success: true, msg: "product deleted successfully" });


    } catch (error) {
        res.send(error.message)
    }
}

// const login_control = async(req, res) => {
//     try {
//         const user_data = req.body;
//         const { error } = login_val({ user_data })
//         if (error) res.send(error.details.map(err => err.message));
//         else {
//             const db_data = await User_schema.findOne({ Email: user_data.Email });
//             if (db_data?.password && db_data?.Email) {
//                 const isMatch_password = bcrypt.compareSync(user_data.password, db_data["password"]);
//                 if (isMatch_password) {
//                     res.send("login successfull");
//                 }
//             } else {
//                 res.send("invalid userName and password");
//             }z
//         };
//     } catch (error) {
//         res.send(error)
//     }
// };



//____________________________________________________________________________________
//____________________________________________________________________________________
//____________________________________________________________________________________
const createUser_controler = async (req, res) => {
    let data = req.body;
    try {
        const { _id: create_by } = getToken_data({ headers: req.headers });
        data["create_by"] = create_by
        const hash_password = bcrypt.hashSync(data["password"], saltRounds);
        data["password"] = hash_password
        const newData = new userSchema(data);
        let resp = await newData.save();
        res.send({ resp })
    } catch (error) {
        res.status(401).send(error)
    }
};

const userList_controler = async (req, res) => {
    try {
        const { _id: create_by } = getToken_data({ headers: req.headers });
        const user_list = await userSchema.find({ create_by });
        if (user_list.length) return res.send(user_list)
        res.status(401).send({ msg: "No User Found" })
    } catch (error) {
        res.status(401).send(error)
    }
};

const deleteUser_controler = async (req, res) => {
    const { Email } = req.body;
    try {
        const { _id: create_by } = getToken_data({ headers: req.headers });
        const response = await userSchema.deleteOne({ Email, create_by });
        if (response?.deletedCount === 0) return res.status(402).send("No User found with given user_id");
        res.send({ msg: "user successfully deleted" });
    } catch (error) {
        res.status(402).send(error);
    }
}
//____________________________________________________________________________________//
//____________________________________________________________________________________
//____________________________________________________________________________________
module.exports = {
    registration_control,
    login_control,
    change_password_controler,
    forgot_password_controler,
    reset_password_controler,
    add_product_control,
    fetch_product_controler,
    update_product_controler,
    delete_product_controler,
    createUser_controler,
    userList_controler,
    deleteUser_controler
}






