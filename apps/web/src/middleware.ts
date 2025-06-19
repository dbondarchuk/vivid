import { chainMiddleware } from "./middleware/chainMiddleware";
import { withAuth } from "./middleware/withAuth";
import { withLogger } from "./middleware/withLogger";

export default chainMiddleware([withLogger, withAuth]);
