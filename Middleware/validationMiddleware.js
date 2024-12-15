// exports.Validate =(schema)=> (req,res,next)=>{
//     const {error} = schema.validate(req.body, { abortEarly: false });
//     if(!error) return next();
//     const message = error.details.map(err=>err.message);
//     res.status(401).send(message);
// }

exports.validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const message = error.details.map((err) => err.message).join(', ');
      return res.status(400).json({ message });
    }
    next();
  };
  