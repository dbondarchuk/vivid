import { chainMiddleware } from "./middleware/chainMiddleware";
import { withAuth } from "./middleware/withAuth";
import { withLanguage } from "./middleware/withLanguage";
import { withLogger } from "./middleware/withLogger";

export default chainMiddleware([withLogger, withAuth, withLanguage]);
