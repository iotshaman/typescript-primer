/* istanbul ignore file */
import { Application, Request, Response } from 'express';
import { IoC, TYPES } from './composition/app.composition';

import { RouteError } from './models/route-error';
import { ILogger } from './logger';
import { HealthController } from './controllers/health/health.controller';

export class ApiRouter {
  
  private logger: ILogger;
  private controllers: any[] = [];

  constructor(private app: Application) {
    this.logger = IoC.get<ILogger>(TYPES.Logger);
    this.loadMiddleware();
    this.loadRoutes();
    this.loadErrorHandlers();
  }

  private loadMiddleware = () => {
    this.app.all('/api/*', this.logApiRequests);
  }

  private loadRoutes = () => {
    this.controllers.push(new HealthController(this.app));
  }

  private loadErrorHandlers = () => {
    this.app.use(this.routeErrors);
  }

  private logApiRequests = (req: Request, res: Response, next: any) => {
    this.logger.write(`${req.method.toUpperCase()} - ${req.url}`);
    next();
  }

  private routeErrors = (err: RouteError, req: Request, res: Response, next: any) => {
    let message = `${req.method.toUpperCase()} - ${req.url} :: ${err.message}`;
    this.logger.write(message, 'error');
    if (err.statusCode != 401 && err.statusCode != 403) {
      if (err.stack) this.logger.write(err.stack);
    }
    if (!err.statusCode) return next();
    if (!err.sendMessge) return res.status(err.statusCode).send('Server Error');
    return res.status(err.statusCode).send(err.message);
  }

}