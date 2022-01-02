/* istanbul ignore file */
import { Request, Response, Application, Router } from "express";
import { injectable } from 'inversify';

import { IoC, TYPES } from "../../composition/app.composition";
import { AppConfig } from "../../models/app.config";

@injectable()
export class HealthController {

  private router: Router;
  private config: AppConfig;

  constructor(private app: Application) {
    this.configure();
    this.config = IoC.get<AppConfig>(TYPES.AppConfig);
  }

  private configure = () => {
    this.router = Router();
    this.router
      .get('/', this.getStatus)

    this.app.use('/api/health', this.router);
  }

  getStatus = (_req: Request, res: Response, _next: any) => {
    res.json({status: 'healthy'});
  }

}