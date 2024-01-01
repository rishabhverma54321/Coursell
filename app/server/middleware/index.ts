import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const privateKey:string = process.env.SECRET_KEY || ""

export const authenticationJwt = (req:any, res:any, next:any) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization?.split(" ")[1];
    jwt.verify(token, privateKey, (err:any, decode:any) => {
      if (err) {
        return res.status(403).json({ message: err });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "User Authentication Failed" });
  }
};

export const generateJwtToken = (user:any) => {
    return jwt.sign({ username: user?.username }, privateKey, {
      expiresIn: "1hr",
    });
  };
