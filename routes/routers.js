const Router = require("express").Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const { create_token, check_token } = require("../Middleware/authMiddleware");
const { registration_control,
    login_control,
    add_product_control,
    forgot_password_controler,
    reset_password_controler,
    fetch_product_controler,
    update_product_controler,
    delete_product_controler,
    change_password_controler,
    createUser_controler,
    deleteUser_controler,
    userList_controler,


} = require("../controlers/users_controler");
const { validate } = require("../Middleware/validationMiddleware");
const { createUserSchema,
    registrationSchema,
    loginSchema,
    forgotPasswordSchema,
    restetPasswordSchema,
    addProductSchema,
    delateUserSchema,
    userListSchema,
} = require("../validation/schema");


// Router.post("/registration", registration_control);
// Router.post("/login",login_control);
Router.post("/changePassword", check_token, change_password_controler);
// Router.post("/forgotPassword", forgot_password_controler);
// Router.post("/resetPassword", reset_password_controler);
// Router.post("/addProduct", check_token, add_product_control);
// Router.get("/productList", check_token, fetch_product_controler);
// Router.post("/updateProduct", check_token, update_product_controler);
// Router.post("/deleteProduct", check_token, delete_product_controler);


Router.post("/registration", validate(registrationSchema), registration_control);
Router.post("/login", validate(loginSchema), login_control);
Router.post("/forgotPassword",validate(forgotPasswordSchema), forgot_password_controler);
Router.post("/resetPassword", check_token, validate(restetPasswordSchema), reset_password_controler);
Router.post("/addProduct", check_token, validate(addProductSchema), add_product_control);
Router.get("/productList", check_token, fetch_product_controler);
Router.post("/updateProduct", check_token, update_product_controler);
Router.post("/deleteProduct", check_token, delete_product_controler);
Router.post("/createUser", check_token, validate(createUserSchema), createUser_controler);
Router.post("/deleteUser", check_token, validate(delateUserSchema), deleteUser_controler);
Router.get("/userList",check_token,userList_controler)
// schemas
// Router.post("/registration", async (req, res) => {
//     try {
//         const data = req.body;
//         const hash_password = bcrypt.hashSync(data["password"], saltRounds)
//         const { error, value } = registration_val({ data })
//         data["password"] = hash_password
//         if (error) res.send(error.details.map(err => err.message));
//         else {
//             const newUser = new User_schema(data);
//             const response = await newUser.save();
//             const token = create_token({ data });
//             res.send({ response, token })
//         }
//     } catch (error) {
//         res.send(error.message)
//     }
// });


// Router.post("/login", check_token, async (req, res,) => {
//     try {
//         const data = req.body;
//         const { password, Email } = data;
//         const { error} = login_val({ data })
//         if (error) res.send(error.details.map(err => err.message));
//         else {
//             const db_data = await User_schema.findOne({ Email });
//             if(!db_data)return res.send("invalid & password")
//             if (data?.password && data?.Email) {
//                 const isMatch_password = bcrypt.compareSync(password, db_data["password"]);
//                 if (isMatch_password) {
//                     res.send("login successfull");
//                 } else {
//                     res.send("invalid userName and password");
//                 }
//             }
//         }
//     } catch (error) {
//         res.send(error)
//     }


// });




// Router.post("/login", check_token, async (req, res,) => {
//     try {
//         const user_data = req.body;
//         const { error } = login_val({ user_data })
//         if (error) return res.send(error.details.map(err => err.message));
//         const db_data = await User_schema.findOne({ Email: user_data.Email });
//         if (db_data?.password && db_data?.Email) {
//             const isMatch_password = bcrypt.compareSync(user_data.password, db_data["password"]);
//             if (isMatch_password) return res.send("login successfull");
//         }
//         res.send("invalid userName and password");
//     } catch (error) {
//         res.send(error)
//     }
// });

module.exports = Router;