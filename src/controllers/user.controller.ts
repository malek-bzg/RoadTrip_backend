import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from "../services/prisma";
import { PrismaClient } from '@prisma/client';
import nodemailer from "nodemailer";
import { Transporter, SentMessageInfo } from 'nodemailer';

interface CreateUserBody {
  id: string;
  fname: string;
  lname: string;
  email: string;
  phonenumber: string;
  password: string;
  adresse: string;
  isVerified: boolean; // Add the isVerified field
}
exports.sendConfirmationEmail = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (user) {
      // token creation
      const token = makeTokenForUser(user.id.toString(),user.email );

      await doSendConfirmationEmail(req.body.email, token);

      res.status(200).send({
        message: "L'email de confirmation a été envoyé à " + user.email,
      });
    } else {
      res.status(404).send({ message: "User inexistant" });
    }
  } catch (error) {
    res.status(500).send({ message: "Une erreur est survenue lors de l'envoi de l'email de confirmation" });
  }
};

export const userController = {
  async index(req: Request, res: Response) {
    const users = await prisma.user.findMany({
       /* where: {
            fname:{
                startsWith:"k",
            },
        },*/
    });
    return res.json(users);
  },
  
  async createUser(req: Request, res: Response) {
    const userData = req.body as CreateUserBody;
    const email = req.body.email;
    const hashedPassword = await bcrypt.hash(userData.password, 10); 
    if (await prisma.user.findUnique({ where: { email  } })) {
      res.status(403).send({ message: "User existe deja !" });
    } else {
      const user = await prisma.user.create({
        data: {
          fname: userData.fname,
          lname: userData.lname,
          email: userData.email,
          phonenumber: userData.phonenumber,
          password :hashedPassword,
          adresse: userData.adresse
          //isVerified: userData.isVerified
      
        }
        
      });
    return res.json({ user : user });


    function makeTokenForUser(_id: string, email: string, tokenSecret: string): string {
      return jwt.sign({ _id, email }, tokenSecret, {
        expiresIn: "100000000", // in Milliseconds (3600000 = 1 hour)
      });
    }

    async function doSendConfirmationEmail(email: string, token: string): Promise<void> {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "esprit.peddler.app@gmail.com",
          pass: "peddler-cred",
        },
      });
      transporter.verify(function (error: Error | null, success: boolean) {
        if (error) {
          console.log(error);
          console.log("Server not ready");
        } else {
          console.log("Server is ready to take our messages");
        }
      });
      
      const urlDeConfirmation = "http://localhost:3333/api/user/confirmation/" + token;
      
      const mailOptions = {
        from: "esprit.peddler.app@gmail.com",
        to: email,
        subject: "Confirm your email",
        html:
          "<h3>Please confirm your email using this link:</h3><a href='" +
          urlDeConfirmation +
          "'>Confirmation</a>",
      };
      
      // Send the email
      transporter.sendMail(mailOptions, function (error: Error | null, info: SentMessageInfo) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    
      // Rest of your email sending logic goes here
  
""
  
      // Send confirmation email
      doSendConfirmationEmail(email, token);
    
      res.status(201).send({
        message: "success",
        user: user,
        token: jwt.verify(token, "MY_TOKEN_SECRET"),
      });
    }

    }
    
  },

  async findUniqueUser(req: Request, res: Response){
    const paramId = req.params.id;

    const uniqueUser = await prisma.user.findUnique({
        where: {
            id:paramId,
        },
    });

    return res.json({uniqueUser: uniqueUser})
  },

  async updateUser(req: Request, res: Response){
    const paramId= req.params.id;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const password = req.body.password
    const adresse = req.body.adresse;

    const updateUser = await prisma.user.update({
        data: {
            fname:fname,
            lname:lname,
            email: email,
            phonenumber: phonenumber,
            password : password,
            adresse:adresse,
        },
        where:{
            id: paramId,
        },
    });

    return res.json({updateUser: updateUser});
  },

  async deletUser(req: Request, res: Response){
    const paramId = req.params.id;

    const deletedUser = await prisma.user.delete({
        where: {
            id : paramId,
        },
    });
  
    return res.json({deletedUser: deletedUser});
  },

  async login (req: Request, res: Response): Promise<void>  {

    const { email, password } = req.body;
  
    const user = await prisma.user.findUnique({ where: { email } });  

    if (user && (await bcrypt.compare(password, user.password))) {

      const token = jwt.sign({ email: email }, tokenSecret, { expiresIn: '36000000' });
      
  
      if (user.isVerified) {
        res.status(200).send({ token, user, message: 'Success' });
      } else {
        res.status(200).send({ user, message: 'Email non vérifié' });
      }
    } else {
      res.status(403).send({ message: 'Mot de passe ou email incorrect' });
    }
  },
  
};

function makeTokenForUser(_id: any, _id1: any) {
  throw new Error("Function not implemented.");
}

function doSendConfirmationEmail(email: any, token: void) {
  throw new Error("Function not implemented.");
}

