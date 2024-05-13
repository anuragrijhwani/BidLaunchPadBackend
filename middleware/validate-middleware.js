
export const validate = (schema) => async (req, res, next) => {
try {
    const parseBody = await schema.parseAsync(req.body);
    req.body=parseBody;
    next();
} catch (err) {
    console.log()
    // res.status(400).json({message:error})
    const status = 400;
    const message = err;
    const error = {status,message}
    next(error)
}
}