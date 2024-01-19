import {
    IsBillingEnabled,
    IsDevelopment,
} from 'CommonServer/EnvironmentConfig';
import RunCron from '../../Utils/Cron';
import { EVERY_DAY, EVERY_MINUTE } from 'Common/Utils/CronTime';
import Services from 'CommonServer/Services/Index';
import DatabaseService from 'CommonServer/Services/DatabaseService';
import OneUptimeDate from 'Common/Types/Date';
import QueryHelper from 'CommonServer/Types/Database/QueryHelper';
import LIMIT_MAX from 'Common/Types/Database/LimitMax';
import logger from 'CommonServer/Utils/Logger';

RunCron(
    'HardDelete:HardDeleteItemsInDatabase',
    { schedule: IsDevelopment ? EVERY_MINUTE : EVERY_DAY, runOnStartup: false },
    async () => {
        if (!IsBillingEnabled) {
            logger.info(
                'HardDelete:HardDeleteItemsInDatabase: Billing is not enabled. Skipping hard delete.'
            );
            return;
        }

        for (const service of Services) {
            if (service instanceof DatabaseService) {
                if (service.doNotAllowDelete) {
                    // marked as do not delete. skip.
                    continue;
                }

                try {
                    // Retain data for 30 days for accidental deletion, and then hard delete.
                    await service.hardDeleteBy({
                        query: {
                            deletedAt: QueryHelper.lessThan(
                                OneUptimeDate.getSomeDaysAgo(30)
                            ),
                        },
                        props: {
                            isRoot: true,
                        },
                        limit: LIMIT_MAX,
                        skip: 0,
                    });
                } catch (err) {
                    logger.error(err);
                }
            }
        }
    }
);

RunCron(
    'HardDelete:HardDeleteOlderItemsInDatabase',
    { schedule: IsDevelopment ? EVERY_MINUTE : EVERY_DAY, runOnStartup: false },
    async () => {
        for (const service of Services) {
            if (service instanceof DatabaseService) {
                if (
                    !service.hardDeleteItemByColumnName ||
                    !service.hardDeleteItemsOlderThanDays
                ) {
                    continue;
                }

                try {
                    // Retain data for 30 days for accidental deletion, and then hard delete.
                    await service.hardDeleteBy({
                        query: {
                            [service.hardDeleteItemByColumnName]:
                                QueryHelper.lessThan(
                                    OneUptimeDate.getSomeDaysAgo(
                                        service.hardDeleteItemsOlderThanDays
                                    )
                                ),
                        },
                        props: {
                            isRoot: true,
                        },
                        limit: LIMIT_MAX,
                        skip: 0,
                    });
                } catch (err) {
                    logger.error(err);
                }
            }
        }
    }
);
