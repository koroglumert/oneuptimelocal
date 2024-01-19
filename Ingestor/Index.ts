import 'ejs';
import { PostgresAppInstance } from 'CommonServer/Infrastructure/PostgresDatabase';
import Express, { ExpressApplication } from 'CommonServer/Utils/Express';
import logger from 'CommonServer/Utils/Logger';
import App from 'CommonServer/Utils/StartServer';
import AliveAPI from './API/Alive';
import RegisterAPI from './API/Register';
import MonitorAPI from './API/Monitor';
import Ingestor from './API/Probe';
import IncomingRequestAPI from './API/IncomingRequest';
import OTelIngestAPI from './API/OTelIngest';
import { ClickhouseAppInstance } from 'CommonServer/Infrastructure/ClickhouseDatabase';

import Redis from 'CommonServer/Infrastructure/Redis';
import Realtime from 'CommonServer/Utils/Realtime';

const app: ExpressApplication = Express.getExpressApp();

const APP_NAME: string = 'ingestor';

app.use([`/${APP_NAME}`, '/'], AliveAPI);
app.use([`/${APP_NAME}`, '/'], RegisterAPI);
app.use([`/${APP_NAME}`, '/'], MonitorAPI);
app.use([`/${APP_NAME}`, '/'], Ingestor);
app.use([`/${APP_NAME}`, '/'], IncomingRequestAPI);
app.use([`/${APP_NAME}`, '/'], OTelIngestAPI);

const init: () => Promise<void> = async (): Promise<void> => {
    try {
        // init the app
        await App(APP_NAME);
        // connect to the database.
        await PostgresAppInstance.connect(
            PostgresAppInstance.getDatasourceOptions()
        );

        // connect redis
        await Redis.connect();

        await ClickhouseAppInstance.connect(
            ClickhouseAppInstance.getDatasourceOptions()
        );

        Realtime.init();
    } catch (err) {
        logger.error('App Init Failed:');
        logger.error(err);
        throw err;
    }
};

init().catch((err: Error) => {
    logger.error(err);
    logger.info('Exiting node process');
    process.exit(1);
});
