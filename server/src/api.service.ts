/* istanbul ignore file */
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors';
import * as compression from 'compression';

import { injectable } from "inversify";
import { IoC, TYPES } from "./composition/app.composition";
import { ApiRouter } from './api.router';
import { AppConfig } from "./models/app.config";
import { ILogger } from "./logger";

export interface IApiService {
  app: express.Application;
  startApplication: () => Promise<void>;
}

@injectable()
export class ApiService implements IApiService {
  
  private config: AppConfig;
  private logger: ILogger;
  public app: express.Application;
  private router: ApiRouter;
  public serverStarted: boolean = false;
  
  constructor() {
    this.config = IoC.get<AppConfig>(TYPES.AppConfig);
    this.logger = IoC.get<ILogger>(TYPES.Logger);
    this.configure();
  }

  private configure = (): void => {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(compression());
    this.app.use(cors({
      credentials: true, 
      methods: 'GET,POST,PUT,DELETE',
      allowedHeaders: allowedHeaders.join(','),
    }));
    this.router = new ApiRouter(this.app);
  }

  public startApplication = (): Promise<void> => {
    return new Promise((res) => {
      if (this.serverStarted) return res();
      this.app.listen(this.config.port, () => {
        this.logger.write(`Express server listening on port ${this.config.port}`);
        this.serverStarted = true;
        res();
      })
    });
  }

}

const allowedHeaders = [
  'Content-Type',
  'Data-Type',
  'Authorization'
]