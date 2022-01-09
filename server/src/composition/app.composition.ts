/* istanbul ignore file */
import "reflect-metadata";
import * as _path from 'path';
import * as express from 'express';
import { Container } from "inversify";

import { TYPES, CONTROLLER_TYPES } from "./app.composition.types";
import { AppConfig } from "../models/app.config";
import { ILogger, Logger } from "../logger";
import { IApiService, ApiService } from "../api.service";
import { IJsonFileService, JsonFileService } from "../services/json-file.service";
import { ApiRouter } from "../api.router";
import { HealthController } from "../controllers/health/health.controller";

export function Configure(config: AppConfig): Promise<Container> {
  return configureServices(new Container(), config)
    .then(container => configureRouter(container));
}

function configureServices(container: Container, config: AppConfig): Promise<Container> {
  container.bind<AppConfig>(TYPES.AppConfig).toConstantValue(config);
  container.bind<ILogger>(TYPES.Logger).to(Logger);
  container.bind<IApiService>(TYPES.ApiService).to(ApiService).inSingletonScope();
  container.bind<express.Application>(TYPES.ExpressApplication).toConstantValue(express());
  container.bind<IJsonFileService>(TYPES.JsonFileService).to(JsonFileService);
  return Promise.resolve(container);
}

function configureRouter(container: Container): Promise<Container> {
  container.bind<ApiRouter>(TYPES.ApiRouter).toDynamicValue((context) => {
    let app = context.container.get<express.Application>(TYPES.ExpressApplication);
    let logger = context.container.get<ILogger>(TYPES.Logger);
    let router = new ApiRouter(app, logger);
    router.configure(context.container)
    return router;
  });
  container.bind<HealthController>(CONTROLLER_TYPES.HealthController).to(HealthController);
  return Promise.resolve(container);
}