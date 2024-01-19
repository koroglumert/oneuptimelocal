// Docs: https://git.rootprojects.org/root/greenlock-manager.js

import StatusPageDomainService from 'CommonServer/Services/StatusPageDomainService';
import StatusPageDomain from 'Model/Models/StatusPageDomain';
import logger from 'CommonServer/Utils/Logger';
import GreenlockCertificate from 'Model/Models/GreenlockCertificate';
import GreenlockCertificateService from 'CommonServer/Services/GreenlockCertificateService';
import LIMIT_MAX from 'Common/Types/Database/LimitMax';
import { JSONObject } from 'Common/Types/JSON';
import JSONFunctions from 'Common/Types/JSONFunctions';

// because greenlock package expects module.exports.
module.exports = {
    create: () => {
        return {
            // Get
            get: async ({
                servername,
            }: {
                servername: string;
            }): Promise<JSONObject | undefined> => {
                // Required: find the certificate with the subject of `servername`
                // Optional (multi-domain certs support): find a certificate with `servername` as an altname
                // Optional (wildcard support): find a certificate with `wildname` as an altname

                // { subject, altnames, renewAt, deletedAt, challenges, ... }
                logger.info('Greenlock Manager Get');
                logger.info(servername);
                const domain: StatusPageDomain | null =
                    await StatusPageDomainService.findOneBy({
                        query: {
                            fullDomain: servername,
                        },
                        props: {
                            isRoot: true,
                            ignoreHooks: true,
                        },
                        select: {
                            _id: true,
                            greenlockConfig: true,
                        },
                    });

                if (!domain || !domain.greenlockConfig) {
                    logger.info(
                        'Greenlock Manager GET ' +
                            servername +
                            ' - No domain found.'
                    );
                    return undefined;
                }

                logger.info('Greenlock Manager GET ' + servername + ' RESULT');
                logger.info(domain.greenlockConfig);

                return domain.greenlockConfig;
            },

            find: async function (args: any) {
                logger.info('Manager Find: ');
                logger.info(JSON.stringify(args, null, 2));

                // { subject, servernames, altnames, renewBefore }

                // i.e. find certs more than 30 days old
                args.issuedBefore = Date.now() - 30 * 24 * 60 * 60 * 1000;
                // i.e. find certs more that will expire in less than 45 days
                //args.expiresBefore = Date.now() + 45 * 24 * 60 * 60 * 1000;
                const issuedBefore: any = args.issuedBefore || Infinity;
                const expiresBefore: any = args.expiresBefore || Infinity; //Date.now() + 21 * 24 * 60 * 60 * 1000;
                const renewBefore: any = args.renewBefore || Infinity; //Date.now() + 21 * 24 * 60 * 60 * 1000;
                // if there's anything to match, only return matches
                // if there's nothing to match, return everything
                const nameKeys: Array<string> = ['subject', 'altnames'];
                const matchAll: boolean = !nameKeys.some((k: string) => {
                    return k in args;
                });

                const querynames: string = (args.altnames || []).slice(0);

                const greenlockCertificates: Array<GreenlockCertificate> =
                    await GreenlockCertificateService.findBy({
                        query: {
                            isKeyPair: false,
                        },
                        limit: LIMIT_MAX,
                        skip: 0,
                        select: {
                            blob: true,
                            key: true,
                        },
                        props: {
                            isRoot: true,
                        },
                    });

                const sites: Array<JSONObject> = greenlockCertificates
                    .filter((i: GreenlockCertificate) => {
                        return i.blob;
                    })
                    .map((i: GreenlockCertificate) => {
                        return JSONFunctions.parse(i.blob!);
                    })
                    .filter((site: any) => {
                        logger.info('Filter Site: ');
                        logger.info(site);
                        if (site.deletedAt) {
                            logger.info('Filter Site: DeletedAt');
                            return false;
                        }
                        if (site.expiresAt >= expiresBefore) {
                            logger.info('Filter Site: expiresAt');
                            return false;
                        }
                        if (site.issuedAt >= issuedBefore) {
                            logger.info('Filter Site: issuedAt');
                            return false;
                        }
                        if (site.renewAt >= renewBefore) {
                            logger.info('Filter Site: renewAt');
                            return false;
                        }

                        // after attribute filtering, before cert filtering
                        if (matchAll) {
                            logger.info('Filter Site: MatchAll');
                            return true;
                        }

                        // if subject is specified, don't return anything else
                        if (site.subject === args.subject) {
                            logger.info('Filter Site: Subject');
                            return true;
                        }

                        // altnames, servername, and wildname all get rolled into one
                        return site.altnames.some((altname: any) => {
                            return querynames.includes(altname);
                        });
                    });

                logger.info('Sites: ');
                logger.info(sites);
                return sites;
            },

            // Set
            set: async (opts: any) => {
                logger.info('Greenlock Manager Set');
                logger.info(opts);

                // { subject, altnames, renewAt, deletedAt }
                // Required: updated `renewAt` and `deletedAt` for certificate matching `subject`

                if (!opts.subject) {
                    return;
                }

                const domain: StatusPageDomain | null =
                    await StatusPageDomainService.findOneBy({
                        query: {
                            fullDomain: opts['subject'] as string,
                        },
                        props: {
                            isRoot: true,
                        },
                        select: {
                            _id: true,
                            greenlockConfig: true,
                        },
                    });

                if (!domain) {
                    return;
                }

                await StatusPageDomainService.updateOneById({
                    id: domain.id!,
                    data: {
                        greenlockConfig: opts,
                    },
                    props: {
                        isRoot: true,
                        ignoreHooks: true,
                    },
                });
            },
        };
    },
};
