const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
import { Request, Response } from "express";



export async function authenticateToken(req: Request, res: Response, next: Function) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWTSecret as string, (err: Error | null, user: any) => {
      console.log(err);
  
      if (err) return res.sendStatus(403);
  
      next();
    });
  }

export async function generateToken(_id: string){
    return jwt.sign({_id},process.env.JWTSecret,{ expiresIn: '10800s' });

}