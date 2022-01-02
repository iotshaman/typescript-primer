/* istanbul ignore file */
import { Container } from 'inversify';

import { Configure, TYPES } from './composition/app.composition';
import { ConfigFactory } from './config.factory';
import { IApiService } from './api.service';

ConfigFactory.GenerateConfig()
  .then(config => Configure(config))
  .then((IoC: Container) => {
    let apiService = IoC.get<IApiService>(TYPES.ApiService);
    return apiService.startApplication();
  })
  .catch(ex => {
    console.dir(ex);
    process.exit(1);
  });