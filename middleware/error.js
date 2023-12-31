export const errorMiddlware = (error, req, res, next) => {

    error.message = error.message || "Internal Server Error"
    error.statusCode = error.statusCode || 500

    res.status(error.statusCode).json({
        success:false,
        message:error.message
    })


}


export const asyncError =  (passedFunc) => (req, res, next) => {
    Promise.resolve(passedFunc(req,res,next)).catch(next)
}


