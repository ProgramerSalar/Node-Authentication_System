import { createTransport } from "nodemailer";



export const sendEmail = async (subject, to, text) => {

  const transport = createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "73db0595117498",
      pass: "6f898d40105940"
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


