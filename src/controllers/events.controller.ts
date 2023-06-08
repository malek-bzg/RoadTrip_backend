import { Request, Response } from "express";
import prisma from "../services/prisma";

interface CreateEventBody {
    nameDestination: string;
    Dateofdeparture: Date;
    maximumNumberOfplaces: string;
    travelTime: string; 
}

export const eventController = {
  async index(req: Request, res: Response) {
    const events = await prisma.event.findMany({
       /* where: {
            fname:{
                startsWith:"k",
            },
        },*/
    });
    return res.json(events);
  },

  async createEvent(req: Request, res: Response) {
    const eventData = req.body as CreateEventBody;
    const event = await prisma.event.create({
        data: {
        nameDestination: eventData.nameDestination,
        Dateofdeparture: eventData.Dateofdeparture,
        maximumNumberOfplaces: eventData.maximumNumberOfplaces,
        travelTime: eventData.travelTime,
        }
      });
    return res.json({ event : event });
  },

  async findUniqueEvent(req: Request, res: Response){
    const paramId = req.params.id;

    const uniqueEvent = await prisma.event.findUnique({
        where: {
            id:paramId,
        },
    });

    return res.json({uniqueEvent: uniqueEvent})
  },

  async updateEvent(req: Request, res: Response){
    const paramId= req.params.id;
    const nameDestination = req.body.nameDestination;
    const Dateofdeparture = req.body.Dateofdeparture;
    const maximumNumberOfplaces = req.body.maximumNumberOfplaces;
    const travelTime = req.body.travelTime;


    const updateEvent = await prisma.event.update({
        data: {
            nameDestination: nameDestination,
            Dateofdeparture: Dateofdeparture,
            maximumNumberOfplaces:maximumNumberOfplaces,
            travelTime: travelTime,
        },
        where:{
            id: paramId,
        },
    });

    return res.json({updateEvent: updateEvent});
  },

  async deletEvent(req: Request, res: Response){
    const paramId = req.params.id;

    const deletedEvent = await prisma.event.delete({
        where: {
            id : paramId,
        },
    });

    return res.json({deletedEvent: deletedEvent});
  },

  
 
};