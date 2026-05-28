import { updateEventsOnDB } from "./workers/eventProjectionWorker";
import { createNewOrder } from "./workers/orderPersistenceWorker";

createNewOrder();
updateEventsOnDB();
