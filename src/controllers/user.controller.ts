import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer, { Transporter } from 'nodemailer';
import { PrismaClient, User } from '@prisma/client';
import multer from "multer";
import { tokenSecret } from "../../config";
import { NextFunction } from 'express';
import sgMail from '@sendgrid/mail';



const prisma = new PrismaClient();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg');
  }
});
const upload = multer({ storage }).single('profilePicture');
export const userController = {
  
  createUser: async (req: Request, res: Response) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).send({ message: "Error uploading file" });
        }

        const { name, phoneNumber, email, password, confirmPassword, isVerified } = req.body;
        if (!name) {
          return res.status(400).send({ message: "voyer rempli tous les champs" });
        }
        if (!password) {
          return res.status(400).send({ message: "voyer rempli tous les champs" });
        }
        if (!email) {
          return res.status(400).send({ message: "voyer rempli tous les champs" });
        }
        if (!confirmPassword) {
          return res.status(400).send({ message: "voyer rempli tous les champs" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await prisma.user.findUnique({ where: { email } });
        const existingPhoneNumber = await prisma.user.findUnique({ where: { phoneNumber } });
        
        if (existingUser) {
          return res.status(403).send({ message: "User already exists!" });
        }
        if (existingPhoneNumber) {
          return res.status(403).send({ message: "Phone number already in use!" });
        }
        const profilePicturePath = req.file ? req.file.path : null;
        const user = await prisma.user.create({
          data: {
            name,
            phoneNumber,
            email,
            password: hashedPassword,
            confirmPassword,
            profilePicture: profilePicturePath,
            isVerified,
          },
        });
        
        const token = jwt.sign({ email }, config.token_secret, {
          expiresIn: '36000000',

        });
        await doSendConfirmationEmail(email, token);
        

        res.status(201).send({
          message: "success",
          user: user,
          token: jwt.verify(token, config.token_secret),
        });

        //return res.json({ user });
       
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "An error occurred while creating the user"});
    }
  },

  index: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();
      return res.json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "An error occurred while retrieving users" });
    }
  },
  async confirmation  (req: Request, res: Response)  {
    let token: any;
  
    try {
      token = jwt.verify(req.params.token, config.token_secret);
    } catch (e) {
      return res.status(400).send({
        message:
          "Le lien de vérification a peut-être expiré. Veuillez vérifier à nouveau votre email.",
      });
    }
  },

  async findUniqueUser(req: Request, res: Response){
    const paramId = req.params.id;

    const uniqueUser = await prisma.user.findUnique({
        where:{
            id:paramId,
        },
    });

    return res.json({uniqueUser: uniqueUser})
  },
  async makeTokenForUser(_id: string, email: string, tokenSecret: string) {
    return jwt.sign({ _id, email }, tokenSecret, {
      expiresIn: " 100000000 ", // in Milliseconds (3600000 = 1 hour)
    });
  },
  async getUserByToken  (req: Request, res: Response)  {
    let token = req.body.token;
  
    try {
      token = jwt.verify(token, config.token_secret);
    } catch (e) {
      return res.sendStatus(404);
    }
  
    const user = await prisma.user.findUnique({ where: { email: token.email } });
  
    res.send({ token, user });
  },

  async sendConfirmationEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (user) {
        // Création du token
        const token = makeTokenForUser(user.id, user.email);
        // Assurez-vous que makeTokenForUser est correctement implémenté
  
        // Envoi de l'e-mail de confirmation
        await doSendConfirmationEmail(email, token);
        // Assurez-vous que doSendConfirmationEmail est correctement implémenté
  
        res.status(200).send({
          message: "L'e-mail de confirmation a été envoyé à " + email,
        });
      } else {
        res.status(404).send({ message: "Utilisateur inexistant" });
      }
    } catch (error) {
      res.status(500).send({ message: "Une erreur s'est produite lors de l'envoi de l'e-mail de confirmation" });
    }
  },
  
   async forgotPassword(req: Request, res: Response): Promise<void> {
    const codeDeReinit = req.body.codeDeReinit;
    const user: User | null = await prisma.user.findUnique({ where: { email: req.body.email } });
  
    if (user) {
      try {
        // Création du token
        const token = jwt.sign(
          { _id: user.id, email: user.email },
          config.token_secret,
          {
            expiresIn: '1h', // 1 heure
          }
        );
  
        await envoyerEmailReinitialisation (req.body.email, codeDeReinit);
  
        res.status(200).send({
          message: `L'e-mail de réinitialisation a été envoyé à ${user.email}`,
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail de réinitialisation :", error);
        res.status(500).send({ message: "Erreur lors de l'envoi de l'e-mail de réinitialisation" });
      }
    } else {
      res.status(404).send({ message: 'Utilisateur inexistant' });
    }
  },
  
    async updateUser(req: Request, res: Response){
    const paramId= req.params.id;
    const name = req.body.name;
    const phoneNumber = req.body.phonenumber;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const updateUser = await prisma.user.update({
        data: {
            name :name,
            phoneNumber :phoneNumber,
            email :email,
            password :password,
            confirmPassword :confirmPassword,
        },
        where:{
            id: paramId,
        },
    });

    return res.json({updateUser: updateUser});
  },
  async editProfilePicture(req: Request, res: Response, next: NextFunction){
    try {
      const file = req.file as Express.Multer.File; // Type assertion to ensure req.file is not undefined
      const userId = req.params.userId;
  
      const editProfilePicture = await prisma.user.update({
        where: { id: userId },
        data: {
          profilePicture: file.filename,
        },
      });
  
      res.send({ editProfilePicture });
    } catch (error) {
      next(error);
    } finally {
      await prisma.$disconnect();
    }
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

  async deleteAll (req: Request, res: Response)  {
    try {
      await prisma.user.deleteMany();
      return res.status(204).send({ message: 'Aucun élément' });
    } catch (error) {
      console.error('Une erreur s\'est produite :', error);
      return res.status(500).send({ message: 'Une erreur s\'est produite' });
    }
  },
  
  async login (req: Request, res: Response): Promise<void> {
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

  async loginWithSocial   (req: Request, res: Response): Promise<void>  {
    const { email, firstName, lastName } = req.body;
  
    if (email === '') {
      res.status(403).send({ message: 'Error please provide an email' });
    } else {
      let user: User | null = await prisma.user.findUnique({ where: { email } });
  
      if (user) {
        console.log('user exists, logging in');
      } else {
        console.log('user does not exist, creating an account');
  
        user = await prisma.user.create({
          data: {
            email,
            name: `${firstName} ${lastName}`,
            phoneNumber: '', // Add the phoneNumber field
            password: '', // Add the password field
            confirmPassword: '', // Add the confirmPassword field
             isVerified: true,
          },
        });
      }
      // Token creation
      const token = jwt.sign({ email }, config.token_secret, {
        expiresIn: '360000000',
      });
  
      res.status(201).send({ message: 'success', user, token });
    }
  },
};

const config = {
  token_secret: 'your_token_secret',
  // Autres propriétés de configuration
};

const makeTokenForUser = (_id: string, email: string): string => {
  const token = jwt.sign({ _id, email }, config.token_secret, {
    expiresIn: "100000000", // en millisecondes (3600000 = 1 heure)
  });

  return token;
};
async function doSendConfirmationEmail(email: string, token: string): Promise<void> {
  try {
    sgMail.setApiKey('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');

    const urlDeConfirmation = "http://localhost:3333/api/user/confirmation/" + token;
    const msg = {
      to: email,
      from: 'application.roadtrip.app@gmail.com',
      subject: 'Confirmation de votre email',
      html: `<h3>Veuillez confirmer votre email en utilisant ce lien :</h3><a href="${urlDeConfirmation}">Confirmation</a>`,
    };

    await sgMail.send(msg);
    console.log("Email envoyé à " + email);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail de confirmation :", error);
  }
}
async function envoyerEmailReinitialisation(email: string, codeDeReinit: string): Promise<void> {
  
  sgMail.setApiKey('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');
  const msg = {
    to: email,
    from: 'application.roadtrip.app@gmail.com',
    subject: 'Réinitialisation de votre mot de passe',
    html: `<h3>Voici votre code de réinitialisation :</h3><p>${codeDeReinit}</p>`,
  };

  await sgMail.send(msg);
}


 







