import express, { Express } from "express";
import bodyParser from "body-parser";
import { carRoutes, userRoutes, OrganisateurRoutes, eventRoutes } from "./routes";

class App {
  public server: Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.server.use(bodyParser.urlencoded({ extended: false }));
    this.server.use(bodyParser.json());
  }

  private routes(): void {
    this.server.use("/api/users", userRoutes);
    this.server.use("/api/login", userRoutes);
    this.server.use("/api/cars", carRoutes);
    this.server.use("/api/organisateurs", OrganisateurRoutes);
    this.server.use("/api/events", eventRoutes);
  }
}

export default new App().server;
