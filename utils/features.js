import { createTransport } from "nodemailer";



export const sendEmail = async (subject, to, text) => {

  const transport = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transport.sendMail({subject, to, text})
}





export const sendToken = (user, res, message, statusCode) => {

    const token = user.generateToken()
    res
    .status(statusCode)
    .cookie("token", token, {
      
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    })
    .json({
      success: true,
      message: message,
      // token,
    });
}


