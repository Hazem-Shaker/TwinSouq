import { ProviderRouter } from "./provider.router";
import { ProviderService } from "./provider.service";
import { FileService } from "../../modules/File/file.service";
export class ProviderModule {
  providerService: ProviderService;
  providerRouter: ProviderRouter;
  fileService: FileService;

  constructor(fileService: FileService) {
    this.fileService = fileService;
    this.providerService = new ProviderService(this.fileService);
    this.providerRouter = new ProviderRouter(this.providerService);
  }

  routerFactory() {
    return this.providerRouter.createRouter();
  }
}
