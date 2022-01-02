/* istanbul ignore file */
import "reflect-metadata";
import * as _path from 'path';
import { Container } from "inversify";

import { AppConfig } from "../models/app.config";
import { ILogger, Logger } from "../logger";
import { IApiService, ApiService } from "../api.service";

export const IoC = new Container();

export function Configure(config: AppConfig): Promise<Container> {
  return configureServices(config);
}

function configureServices(config: AppConfig): Promise<Container> {
  IoC.bind<AppConfig>(TYPES.AppConfig).toConstantValue(config);
  IoC.bind<ILogger>(TYPES.Logger).to(Logger);
  IoC.bind<IApiService>(TYPES.ApiService).to(ApiService);
  return Promise.resolve(IoC);
}

const TYPES = {
  AppConfig: "AppConfig",
  Logger: "Logger",
  ApiService: "ApiService"
};

export { TYPES };