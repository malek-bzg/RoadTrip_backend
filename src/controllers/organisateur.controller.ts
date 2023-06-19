import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import multer from "multer";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { tokenSecret } from "../../config";
import { NextFunction } from 'express';


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

const upload = multer({ storage }).single('organisateurPicture');


export const organisateurController = {

  async createOrganisateur(req: Request, res: Response) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).send({ message: "Error uploading file" });
        }

        const { fname, lname, email, phonenumber, adresse, password , isVerified } = req.body;
        if (!fname) {
          return res.status(400).send({ message: "voyer rempli tous les champs" });
        }
        if (!lname) {
          return res.status(400).send({ message: "voyer rempli tous les champs" });
        }
        if (!email) {
          return res.status(400).send({ message: "voyer rempli tous les champs" });
        }
        if (!phonenumber) {
          return res.status(400).send({ message: "voyer rempli tous les champs" });
        }
        if (!adresse) {
          return res.status(400).send({ message: "voyer rempli tous les champs" });
        }
        if (!password) {
          return res.status(400).send({ message: "Password is required" });
        }

        const existingUser = await prisma.organisateur.findUnique({ where: { email } });
      

        if (existingUser) {
          return res.status(403).send({ message: "organisateur already exists!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const organisateurPicturePath = req.file ? req.file.path : null;

        const organisateur = await prisma.organisateur.create({
          data: {
            fname,
            lname,
            email,
            phonenumber,
            adresse,
            password: hashedPassword,
            organisateurPicture: organisateurPicturePath,
            isVerified,
          },
        });
        const token = jwt.sign({ email }, config.token_secret, {
          expiresIn: '36000000',
        });

        //return res.json({ organisateur });

        res.status(201).send({
          message: "success",
          organisateur: organisateur,
          token: jwt.verify(token, config.token_secret),
        });

    
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "An error occurred while creating the organisateur"});
    }
 
  },

  async index(req: Request, res: Response) {
    const organisateurs = await prisma.organisateur.findMany({
    });
    return res.json(organisateurs);
  },
  

  async findUniqueOrganisateur(req: Request, res: Response){
    const paramId = req.params.id;

    const uniqueOrganisateur = await prisma.organisateur.findUnique({
        where: {
            id:paramId,
        },
    });

    return res.json({ uniqueOrganisateur: uniqueOrganisateur })
  },
  async updateOrganisateur( req: Request, res: Response ){
    const paramId= req.params.id;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const adresse = req.body.adresse;
    const password = req.body.password;
    const updateOrganisateur = await prisma.organisateur.update({
        data: {
            fname:fname,
            lname: lname,
            email: email,
            phonenumber: phonenumber,
            adresse:adresse,
            password: password
           },
        where:{
            id: paramId,
        },
    });
    return res.json({updateOrganisateur: updateOrganisateur});
  },

  async editOrganisateurPicture(req: Request, res: Response, next: NextFunction){
    try {
      const file = req.file as Express.Multer.File; // Type assertion to ensure req.file is not undefined
      const organisateurId = req.params.organisateurId;
  
      const editOrganisateurPicture = await prisma.organisateur.update({
        where: { id: organisateurId },
        data: {
          organisateurPicture: file.filename,
        },
      });
  
      res.send({ editOrganisateurPicture });
    } catch (error) {
      next(error);
    } finally {
      await prisma.$disconnect();
    }
  },

  async deletOrganisateur(req: Request, res: Response){
    const paramId = req.params.id;
    const deletedOrganisateur = await prisma.organisateur.delete({
        where: {
            id : paramId,
        },
    });
    return res.json({deletedOrganisateur: deletedOrganisateur});
  },
  
};
const config = {
  token_secret: 'your_token_secret',
  // Autres propriétés de configuration
};
