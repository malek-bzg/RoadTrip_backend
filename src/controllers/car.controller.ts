
import { Request, Response } from "express";
import prisma from "../services/prisma";


export const carController = {
    async index(req:Request, res:Response){
        const cars = await prisma.car.findMany();
        return res.json(cars);
    },

    async createCar(req: Request, res: Response){
        const carData = req.body;
        const car = await prisma.car.create({
            data: {
                name: carData.name,
                color: carData.color,
                userId:carData.userId,
            },
        });
        return res.json({car: car});
    },

    async findUniqueCar(req: Request, res: Response){
        const paramId = req.params.id;
    
        const uniqueCar = await prisma.car.findUnique({
            where: {
                id:paramId,
            },
        });
    
        return res.json({uniqueCar: uniqueCar})
      },

    async updateCar(req: Request, res: Response){
        const paramId= req.params.id;
        const name = req.body.name;
        const color = req.body.color;
        const userId = req.body.userId;
    
    
        const updateCar = await prisma.car.update({
            data: {
                name:name,
                color:color,
                userId: userId,
                
            },
            where:{
                id: paramId,
            },
        });
    
        return res.json({updateCar: updateCar});
      },
      async deletCar(req: Request, res: Response){
        const paramId = req.params.id;
    
        const deletedCar = await prisma.car.delete({
            where: {
                id : paramId,
            },
        });
    
        return res.json({deletedCar: deletedCar});
      },   
};