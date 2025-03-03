import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const routerDoc = Router();

const pathDocument = YAML.load(path.join(__dirname, "../../public/api-doc/api_collection.yaml"));

routerDoc.use("/", swaggerUi.serve, swaggerUi.setup(pathDocument));

export default routerDoc;
