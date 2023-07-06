import express, { Express } from "express";
import bodyParser from "body-parser";
import { carRoutes, userRoutes, OrganisateurRoutes, eventRoutes , userViewRoutes  } from "./routes";
import dashboardViewsRoutes from "./routes/dashboard.views.routes";
import organisateurViewRoutes from "./routes/organisateur.views.routes";
import eventsViewRoutes from "./routes/events.view.routes";
import carsViewRoutes from "./routes/car.views.routes"
const path = require("path");

class App {
  public server: Express;

  constructor() {
    this.server = express();
    this.middlewares();
    this.server.set('view engine' , 'ejs');
    this.routes();
  }

  private middlewares(): void {
    this.server.use(bodyParser.urlencoded({ extended: false }));
    this.server.use(bodyParser.json());
  }

  private routes(): void {
    this.server.use("/api/users", userRoutes);
    this.server.use("/users", userViewRoutes);
    this.server.use("/dashboard", dashboardViewsRoutes);
    this.server.use("/api/login", userRoutes);
    this.server.use("/api/cars", carRoutes);
    this.server.use("/cars", carsViewRoutes);
    this.server.use("/api/organisateurs", OrganisateurRoutes);
    this.server.use("/organisateurs", organisateurViewRoutes );
    this.server.use("/api/events", eventRoutes);
    this.server.use("/events" , eventsViewRoutes)
    

  }
}

export default new App().server;
