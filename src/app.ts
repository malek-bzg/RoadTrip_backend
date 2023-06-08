require('dotenv').config()
import express from "express";
import { carRoutes, userRoutes, OrganisateurRoutes, eventRoutes } from "./routes";


class App{
    public server;

    constructor(){
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json()); 
    }

    routes() {
        this.server.use("/api/users", userRoutes);
        this.server.use("/api/login", userRoutes);
        this.server.use("/api/cars", carRoutes);
        this.server.use("/api/organisateurs", OrganisateurRoutes);
        this.server.use("/api/events", eventRoutes);

    }
}

export default new App().server;