import { Request, Response } from "express";
import prisma from "../services/prisma";


interface CreateOrganisateurBody {
  fname: string;
  lname: string;
  email: string;
  phonenumber: string;
  adresse: string;
}
export const organisateurController = {
  async index(req: Request, res: Response) {
    const organisateurs = await prisma.organisateur.findMany({
       /*where: {
            fname:{
                startsWith:"k",
            },
        },*/
    });
    return res.json(organisateurs);
  },

  async createOrganisateur(req: Request, res: Response) {
    const organisateurData = req.body as CreateOrganisateurBody;
    const organisateur = await prisma.organisateur.create({
        data: {
          fname: organisateurData.fname,
          lname: organisateurData.lname,
          email: organisateurData.email,
          phonenumber: organisateurData.phonenumber,
          adresse: organisateurData.adresse,
        }
      });
    return res.json({ organisateur : organisateur });
  },

  async findUniqueOrganisateur(req: Request, res: Response){
    const paramId = req.params.id;

    const uniqueOrganisateur = await prisma.organisateur.findUnique({
        where: {
            id:paramId,
        },
    });

    return res.json({uniqueOrganisateur: uniqueOrganisateur})
  },

  async updateOrganisateur(req: Request, res: Response){
    const paramId= req.params.id;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const adresse = req.body.adresse

    const updateOrganisateur = await prisma.organisateur.update({
        data: {
            fname:fname,
            lname: lname,
            email: email,
            phonenumber: phonenumber,
            adresse:adresse,
           },
        where:{
            id: paramId,
        },
    });
    return res.json({updateOrganisateur: updateOrganisateur});
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
