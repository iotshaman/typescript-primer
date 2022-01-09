/* istanbul ignore file */
import { Application, Request, Response } from 'express';
import { injectable, interfaces } from 'inversify';

import { RouteError } from './models/route-error';
import { ILogger } from './logger';
import { CONTROLLER_TYPES } from './composition/app.composition.types';
import { HealthController } from './controllers/health/health.controller';

@injectable()
export class ApiRouter {
  
  private controllers: any[];

  constructor(private app: Application, private logger: ILogger) {
    
  }

  public configure = (container: interfaces.Container): void => {
    this.loadMiddleware();
    this.loadControllers(container);
    this.loadErrorHandlers();
  }

  private loadMiddleware = () => {
    this.app.all('/api/*', this.logApiRequests);
  }

  private loadControllers = (container: interfaces.Container): void => {
    this.controllers = [
      container.get<HealthController>(CONTROLLER_TYPES.HealthController)
    ]
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