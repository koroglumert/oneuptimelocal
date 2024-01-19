import JsonToCsv from './JsonToCsv';
import logger from './Logger';
import {
    OneUptimeRequest,
    ExpressResponse,
    ExpressRequest,
    OneUptimeResponse,
} from './Express';
import { JSONObject, JSONArray, JSONObjectOrArray } from 'Common/Types/JSON';
import Exception from 'Common/Types/Exception/Exception';
import ListData from 'Common/Types/ListData';
import PositiveNumber from 'Common/Types/PositiveNumber';
import URL from 'Common/Types/API/URL';
import BaseModel from 'Common/Models/BaseModel';
import EmptyResponse from 'Common/Types/API/EmptyResponse';
import FileModel from 'Common/Models/FileModel';
import Dictionary from 'Common/Types/Dictionary';
import StatusCode from 'Common/Types/API/StatusCode';
import { DEFAULT_LIMIT } from 'Common/Types/Database/LimitMax';
import AnalyticsDataModel from 'Common/AnalyticsModels/BaseModel';

export default class Response {
    private static logResponse(
        req: ExpressRequest,
        res: ExpressResponse,
        responsebody?: JSONObjectOrArray
    ): void {
        const oneUptimeRequest: OneUptimeRequest = req as OneUptimeRequest;
        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        const requestEndedAt: Date = new Date();
        const method: string = oneUptimeRequest.method;
        const path: string = oneUptimeRequest.originalUrl.toString();

        const logLine: JSONObject = {
            RequestID: `${oneUptimeRequest.id}`,

            PodName: `${process.env['POD_NAME'] || 'NONE'}`,

            HTTPMethod: `${method}`,

            Path: `${path.toString()}`,

            RequestDuration: `${(
                requestEndedAt.getTime() -
                (oneUptimeRequest.requestStartedAt as Date).getTime()
            ).toString()}ms`,

            ResponseStatus: `${oneUptimeResponse.statusCode}`,

            Host: `${oneUptimeRequest.hostname}`,

            ResponseBody: `${
                responsebody ? JSON.stringify(responsebody, null, 2) : 'EMPTY'
            }`,
        };

        if (oneUptimeResponse.statusCode > 299) {
            logger.error(logLine);
        } else {
            logger.info(logLine);
        }
    }

    public static sendEmptyResponse(
        req: ExpressRequest,
        res: ExpressResponse
    ): void {
        const oneUptimeRequest: OneUptimeRequest = req as OneUptimeRequest;
        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        oneUptimeResponse.set(
            'ExpressRequest-Id',
            oneUptimeRequest.id.toString()
        );
        oneUptimeResponse.set('Pod-Id', process.env['POD_NAME']);

        oneUptimeResponse.status(200).send({} as EmptyResponse);

        return this.logResponse(req, res, undefined);
    }

    public static sendCustomResponse(
        req: ExpressRequest,
        res: ExpressResponse,
        statusCode: number,
        body: JSONObject | string,
        headers: Dictionary<string>
    ): void {
        const oneUptimeRequest: OneUptimeRequest = req as OneUptimeRequest;
        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        if (headers) {
            for (const key in headers) {
                oneUptimeResponse.set(key, headers[key]?.toString() || '');
            }
        }

        oneUptimeResponse.set(
            'ExpressRequest-Id',
            oneUptimeRequest.id.toString()
        );
        oneUptimeResponse.set('Pod-Id', process.env['POD_NAME']);

        oneUptimeResponse.status(statusCode).send(body);

        return this.logResponse(req, res, undefined);
    }

    public static async sendFileResponse(
        req: ExpressRequest | ExpressRequest,
        res: ExpressResponse,
        file: FileModel
    ): Promise<void> {
        /** Create read stream */

        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        /** Set the proper content type */
        oneUptimeResponse.set('Content-Type', file.type);
        oneUptimeResponse.status(200);
        /** Return response */
        // readstream.pipe(res);

        oneUptimeResponse.send(file.file);

        this.logResponse(req, res);
    }

    public static render(
        req: ExpressRequest,
        res: ExpressResponse,
        path: string,
        vars: JSONObject
    ): void {
        const oneUptimeRequest: OneUptimeRequest = req as OneUptimeRequest;
        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        oneUptimeResponse.set(
            'ExpressRequest-Id',
            oneUptimeRequest.id.toString()
        );
        oneUptimeResponse.set('Pod-Id', process.env['POD_NAME']);

        oneUptimeResponse.render(path, vars);

        return this.logResponse(req, res, { render: path, vars: vars });
    }

    public static sendErrorResponse(
        req: ExpressRequest,
        res: ExpressResponse,
        error: Exception
    ): void {
        const oneUptimeRequest: OneUptimeRequest = req as OneUptimeRequest;
        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        oneUptimeResponse.logBody = { message: error.message }; // To be used in 'auditLog' middleware to log response data;
        const status: number = error.code || 500;
        const message: string = error.message || 'Server Error';

        logger.error(error);

        oneUptimeResponse.set(
            'ExpressRequest-Id',
            oneUptimeRequest.id.toString()
        );
        oneUptimeResponse.set('Pod-Id', process.env['POD_NAME']);

        oneUptimeResponse.status(status).send({ message });
        return this.logResponse(req, res, { message });
    }

    public static sendEntityArrayResponse(
        req: ExpressRequest,
        res: ExpressResponse,
        list: Array<BaseModel | AnalyticsDataModel>,
        count: PositiveNumber | number,
        modelType: { new (): BaseModel | AnalyticsDataModel }
    ): void {
        if (!(count instanceof PositiveNumber)) {
            count = new PositiveNumber(count);
        }

        let jsonArray: JSONArray = [];

        const model: BaseModel | AnalyticsDataModel = new modelType();

        if (model instanceof BaseModel) {
            jsonArray = BaseModel.toJSONArray(
                list as Array<BaseModel>,
                modelType as { new (): BaseModel }
            );
        }

        if (model instanceof AnalyticsDataModel) {
            jsonArray = AnalyticsDataModel.toJSONArray(
                list as Array<AnalyticsDataModel>,
                modelType as { new (): AnalyticsDataModel }
            );
        }

        return this.sendJsonArrayResponse(req, res, jsonArray, count);
    }

    public static sendEntityResponse(
        req: ExpressRequest,
        res: ExpressResponse,
        item: BaseModel | AnalyticsDataModel | null,
        modelType: { new (): BaseModel | AnalyticsDataModel },
        options?:
            | {
                  miscData?: JSONObject;
              }
            | undefined
    ): void {
        let response: JSONObject = {};

        if (item && item instanceof BaseModel) {
            response = BaseModel.toJSON(
                item,
                modelType as { new (): BaseModel }
            );
        }

        if (item && item instanceof AnalyticsDataModel) {
            response = AnalyticsDataModel.toJSON(
                item,
                modelType as { new (): AnalyticsDataModel }
            );
        }

        if (options?.miscData) {
            response['_miscData'] = options.miscData;
        }

        return this.sendJsonObjectResponse(req, res, response);
    }

    public static redirect(
        req: ExpressRequest,
        res: ExpressResponse,
        url: URL
    ): void {
        const oneUptimeRequest: OneUptimeRequest = req as OneUptimeRequest;
        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        oneUptimeResponse.set(
            'ExpressRequest-Id',
            oneUptimeRequest.id.toString()
        );
        oneUptimeResponse.set('Pod-Id', process.env['POD_NAME']);

        this.logResponse(req, res, { redirect: url.toString() });

        return res.redirect(url.toString());
    }

    public static sendJsonArrayResponse(
        req: ExpressRequest,
        res: ExpressResponse,
        list: Array<JSONObject>,
        count: PositiveNumber
    ): void {
        const oneUptimeRequest: OneUptimeRequest = req as OneUptimeRequest;
        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        oneUptimeResponse.set(
            'ExpressRequest-Id',
            oneUptimeRequest.id.toString()
        );
        oneUptimeResponse.set('Pod-Id', process.env['POD_NAME']);

        const listData: ListData = new ListData({
            data: [],
            count: new PositiveNumber(0),
            skip: new PositiveNumber(0),
            limit: new PositiveNumber(0),
        });

        if (!list) {
            list = [];
        }

        listData.data = list as JSONArray;

        if (count) {
            listData.count = count;
        } else if (list) {
            listData.count = new PositiveNumber(list.length);
        }

        if (oneUptimeRequest.query['skip']) {
            listData.skip = new PositiveNumber(
                parseInt(oneUptimeRequest.query['skip'].toString())
            );
        }

        if (oneUptimeRequest.query['limit']) {
            listData.limit = new PositiveNumber(
                parseInt(oneUptimeRequest.query['limit'].toString())
            );
        } else {
            listData.limit = new PositiveNumber(DEFAULT_LIMIT);
        }

        if (oneUptimeRequest.query['output-type'] === 'csv') {
            const csv: string = JsonToCsv.ToCsv(listData.data);
            oneUptimeResponse.status(200).send(csv);
        } else {
            oneUptimeResponse.status(200).send(listData);
            oneUptimeResponse.logBody = listData.toJSON(); // To be used in 'auditLog' middleware to log response data;
            this.logResponse(req, res, listData.toJSON());
        }
    }

    public static sendJsonObjectResponse(
        req: ExpressRequest,
        res: ExpressResponse,
        item: JSONObject,
        options?: {
            statusCode?: StatusCode;
        }
    ): void {
        const oneUptimeRequest: OneUptimeRequest = req as OneUptimeRequest;
        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        oneUptimeResponse.set(
            'ExpressRequest-Id',
            oneUptimeRequest.id.toString()
        );

        oneUptimeResponse.set('Pod-Id', process.env['POD_NAME']);

        if (oneUptimeRequest.query['output-type'] === 'csv') {
            const csv: string = JsonToCsv.ToCsv([item as JSONObject]);
            oneUptimeResponse.status(200).send(csv);
            this.logResponse(req, res);
            return;
        }

        oneUptimeResponse.logBody = item as JSONObject;
        oneUptimeResponse
            .status(options?.statusCode ? options?.statusCode.toNumber() : 200)
            .send(item);
        this.logResponse(req, res, item as JSONObject);
    }

    public static sendTextResponse(
        req: ExpressRequest,
        res: ExpressResponse,
        text: string
    ): void {
        const oneUptimeRequest: OneUptimeRequest = req as OneUptimeRequest;
        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        oneUptimeResponse.set(
            'ExpressRequest-Id',
            oneUptimeRequest.id.toString()
        );

        oneUptimeResponse.set('Pod-Id', process.env['POD_NAME']);

        oneUptimeResponse.logBody = { text: text as string };
        oneUptimeResponse.status(200).send(text);
        this.logResponse(req, res, { text: text as string });
    }

    public static sendHtmlResponse(
        req: ExpressRequest,
        res: ExpressResponse,
        html: string
    ): void {
        const oneUptimeRequest: OneUptimeRequest = req as OneUptimeRequest;
        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        oneUptimeResponse.set(
            'ExpressRequest-Id',
            oneUptimeRequest.id.toString()
        );

        oneUptimeResponse.set('Pod-Id', process.env['POD_NAME']);

        oneUptimeResponse.logBody = { html: html as string };
        oneUptimeResponse.writeHead(200, { 'Content-Type': 'text/html' });
        oneUptimeResponse.end(html);
        this.logResponse(req, res, { html: html as string });
    }

    public static sendXmlResponse(
        req: ExpressRequest,
        res: ExpressResponse,
        xml: string
    ): void {
        const oneUptimeRequest: OneUptimeRequest = req as OneUptimeRequest;
        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        oneUptimeResponse.set(
            'ExpressRequest-Id',
            oneUptimeRequest.id.toString()
        );

        oneUptimeResponse.set('Pod-Id', process.env['POD_NAME']);

        oneUptimeResponse.logBody = { xml: xml as string };
        oneUptimeResponse.writeHead(200, { 'Content-Type': 'text/xml' });
        oneUptimeResponse.end(xml);
        this.logResponse(req, res, { xml: xml as string });
    }

    public static sendJavaScriptResponse(
        req: ExpressRequest,
        res: ExpressResponse,
        javascript: string
    ): void {
        const oneUptimeRequest: OneUptimeRequest = req as OneUptimeRequest;
        const oneUptimeResponse: OneUptimeResponse = res as OneUptimeResponse;

        oneUptimeResponse.set(
            'ExpressRequest-Id',
            oneUptimeRequest.id.toString()
        );

        oneUptimeResponse.set('Pod-Id', process.env['POD_NAME']);

        oneUptimeResponse.logBody = { javascript: javascript as string };
        oneUptimeResponse.writeHead(200, { 'Content-Type': 'text/javascript' });
        oneUptimeResponse.end(javascript);
        this.logResponse(req, res, { javascript: javascript as string });
    }
}
