import URL from 'Common/Types/API/URL';
import Headers from 'Common/Types/API/Headers';
import PositiveNumber from 'Common/Types/PositiveNumber';
import API from 'Common/Utils/API';
import Protocol from 'Common/Types/API/Protocol';
import { JSONObject } from 'Common/Types/JSON';
import HTTPMethod from 'Common/Types/API/HTTPMethod';
import HTTPResponse from 'Common/Types/API/HTTPResponse';
import HTTPErrorResponse from 'Common/Types/API/HTTPErrorResponse';
import logger from 'CommonServer/Utils/Logger';
import ObjectID from 'Common/Types/ObjectID';
import Sleep from 'Common/Types/Sleep';
import OnlineCheck from '../../OnlineCheck';

export interface APIResponse {
    url: URL;
    requestHeaders: Headers;
    requestBody: JSONObject;
    isSecure: boolean;
    responseTimeInMS: PositiveNumber;
    statusCode: number;
    responseBody: string;
    responseHeaders: Headers;
    isOnline: boolean;
    failureCause: string;
}

export default class ApiMonitor {
    public static async ping(
        url: URL,
        options: {
            requestHeaders?: Headers | undefined;
            requestBody?: JSONObject | undefined;
            requestType?: HTTPMethod | undefined;
            isHeadRequest?: boolean | undefined;
            retry?: number | undefined;
            currentRetryCount?: number | undefined;
            monitorId?: ObjectID | undefined;
            isOnlineCheckRequest?: boolean | undefined;
        }
    ): Promise<APIResponse | null> {
        if (!options) {
            options = {};
        }

        if (options?.currentRetryCount === undefined) {
            options.currentRetryCount = 1;
        }

        let requestType: HTTPMethod = options.requestType || HTTPMethod.GET;

        if (options.isHeadRequest) {
            requestType = HTTPMethod.HEAD;
        }

        try {
            logger.info(
                `API Monitor - Pinging ${options.monitorId?.toString()} ${requestType} ${url.toString()} - Retry: ${
                    options.currentRetryCount
                }`
            );

            let startTime: [number, number] = process.hrtime();
            let result: HTTPResponse<JSONObject> | HTTPErrorResponse =
                await API.fetch(
                    requestType,
                    url,
                    options.requestBody || undefined,
                    options.requestHeaders || undefined
                );

            if (
                result.statusCode >= 400 &&
                result.statusCode < 600 &&
                requestType === HTTPMethod.HEAD
            ) {
                startTime = process.hrtime();
                result = await API.fetch(
                    HTTPMethod.GET,
                    url,
                    options.requestBody || undefined,
                    options.requestHeaders || undefined
                );
            }

            if (result.statusCode >= 500 && result.statusCode < 600) {
                // implement retry, just to be sure server is down.
                if (!options) {
                    options = {};
                }

                if (!options.currentRetryCount) {
                    options.currentRetryCount = 0; // default value
                }

                if (options.currentRetryCount < (options.retry || 5)) {
                    options.currentRetryCount++;
                    await Sleep.sleep(1000);
                    return await this.ping(url, options);
                }
            }

            const endTime: [number, number] = process.hrtime(startTime);
            const responseTimeInMS: PositiveNumber = new PositiveNumber(
                (endTime[0] * 1000000000 + endTime[1]) / 1000000
            );

            // if response time is greater than 10 seconds then give it one more try

            if (
                responseTimeInMS.toNumber() > 10000 &&
                options.currentRetryCount < (options.retry || 5)
            ) {
                options.currentRetryCount++;
                await Sleep.sleep(1000);
                return await this.ping(url, options);
            }

            const apiResponse: APIResponse = {
                url: url,
                requestHeaders: options.requestHeaders || {},
                // if server is responding, it is online.
                isOnline: true,
                isSecure: url.protocol === Protocol.HTTPS,
                responseTimeInMS: responseTimeInMS,
                statusCode: result.statusCode,
                responseBody: JSON.stringify(result.data || {}),
                responseHeaders: result.headers,
                requestBody: options.requestBody || {},
                failureCause: '',
            };

            logger.info(
                `API Monitor - Pinging  ${options.monitorId?.toString()} ${requestType} ${url.toString()} Success - Response: ${JSON.stringify(
                    apiResponse
                )}`
            );

            return apiResponse;
        } catch (err: unknown) {
            if (!options) {
                options = {};
            }

            if (!options.currentRetryCount) {
                options.currentRetryCount = 0; // default value
            }

            if (options.currentRetryCount < (options.retry || 5)) {
                options.currentRetryCount++;
                await Sleep.sleep(1000);
                return await this.ping(url, options);
            }

            if (!options.isOnlineCheckRequest) {
                if (!(await OnlineCheck.isProbeOnline())) {
                    logger.error(
                        `API Monitor - Probe is not online. Cannot ping  ${options.monitorId?.toString()} ${requestType} ${url.toString()} - ERROR: ${err}`
                    );
                    return null;
                }
            }

            const apiResponse: APIResponse = {
                url: url,
                isOnline: false,
                requestBody: options.requestBody || {},
                requestHeaders: options.requestHeaders || {},
                isSecure: url.protocol === Protocol.HTTPS,
                responseTimeInMS: new PositiveNumber(0),
                statusCode: 0,
                responseBody: '',
                responseHeaders: {},
                failureCause: (err as any).toString(),
            };

            // check if timeout exceeded and if yes, return null
            if (
                (err as any).toString().includes('timeout') &&
                (err as any).toString().includes('exceeded')
            ) {
                logger.info(
                    `API Monitor - Timeout exceeded ${options.monitorId?.toString()} ${requestType} ${url.toString()} - ERROR: ${err}`
                );

                apiResponse.failureCause = 'Timeout exceeded';
                apiResponse.isOnline = false;
            }

            logger.error(
                `API Monitor - Pinging  ${options.monitorId?.toString()} ${requestType} ${url.toString()} - ERROR: ${err} Response: ${JSON.stringify(
                    apiResponse
                )}`
            );

            return apiResponse;
        }
    }
}
