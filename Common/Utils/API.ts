import axios, { AxiosError, AxiosResponse } from 'axios';
import URL from '../Types/API/URL';
import { JSONObject, JSONArray } from '../Types/JSON';
import Headers from '../Types/API/Headers';
import HTTPResponse from '../Types/API/HTTPResponse';
import HTTPErrorResponse from '../Types/API/HTTPErrorResponse';
import HTTPMethod from '../Types/API/HTTPMethod';
import APIException from '../Types/Exception/ApiException';
import Protocol from '../Types/API/Protocol';
import Hostname from '../Types/API/Hostname';
import Route from '../Types/API/Route';
import BaseModel from '../Models/BaseModel';
import Dictionary from '../Types/Dictionary';
import AnalyticsBaseModel from '../AnalyticsModels/BaseModel';

export default class API {
    private _protocol: Protocol = Protocol.HTTPS;
    public get protocol(): Protocol {
        return this._protocol;
    }
    public set protocol(v: Protocol) {
        this._protocol = v;
    }

    private _hostname!: Hostname;
    public get hostname(): Hostname {
        return this._hostname;
    }
    public set hostname(v: Hostname) {
        this._hostname = v;
    }

    private _baseRoute!: Route;
    public get baseRoute(): Route {
        return this._baseRoute;
    }
    public set baseRoute(v: Route) {
        this._baseRoute = v;
    }

    public constructor(
        protocol: Protocol,
        hostname: Hostname,
        baseRoute?: Route
    ) {
        this.protocol = protocol;
        this.hostname = hostname;

        if (baseRoute) {
            this.baseRoute = baseRoute;
        } else {
            this.baseRoute = new Route('/');
        }
    }

    public async get<
        T extends JSONObject | JSONArray | BaseModel | Array<BaseModel>
    >(
        path: Route,
        data?: JSONObject | JSONArray,
        headers?: Headers
    ): Promise<HTTPResponse<T> | HTTPErrorResponse> {
        return await API.get<T>(
            new URL(
                this.protocol,
                this.hostname,
                this.baseRoute.addRoute(path)
            ),
            data,
            headers
        );
    }

    public async delete<
        T extends JSONObject | JSONArray | BaseModel | Array<BaseModel>
    >(
        path: Route,
        data?: JSONObject | JSONArray,
        headers?: Headers
    ): Promise<HTTPResponse<T> | HTTPErrorResponse> {
        return await API.delete<T>(
            new URL(
                this.protocol,
                this.hostname,
                this.baseRoute.addRoute(path)
            ),
            data,
            headers
        );
    }

    public async head<
        T extends JSONObject | JSONArray | BaseModel | Array<BaseModel>
    >(
        path: Route,
        data?: JSONObject | JSONArray,
        headers?: Headers
    ): Promise<HTTPResponse<T> | HTTPErrorResponse> {
        return await API.head<T>(
            new URL(
                this.protocol,
                this.hostname,
                this.baseRoute.addRoute(path)
            ),
            data,
            headers
        );
    }

    public async put<
        T extends JSONObject | JSONArray | BaseModel | Array<BaseModel>
    >(
        path: Route,
        data?: JSONObject | JSONArray,
        headers?: Headers
    ): Promise<HTTPResponse<T> | HTTPErrorResponse> {
        return await API.put<T>(
            new URL(
                this.protocol,
                this.hostname,
                this.baseRoute.addRoute(path)
            ),
            data,
            headers
        );
    }

    public async post<
        T extends JSONObject | JSONArray | BaseModel | Array<BaseModel>
    >(
        path: Route,
        data?: JSONObject | JSONArray,
        headers?: Headers
    ): Promise<HTTPResponse<T> | HTTPErrorResponse> {
        return await API.post<T>(
            new URL(
                this.protocol,
                this.hostname,
                this.baseRoute.addRoute(path)
            ),
            data,
            headers
        );
    }

    protected static handleError(
        error: HTTPErrorResponse | APIException
    ): HTTPErrorResponse | APIException {
        return error;
    }

    protected static async onResponseSuccessHeaders(
        headers: Dictionary<string>
    ): Promise<Dictionary<string>> {
        return Promise.resolve(headers);
    }

    public static getDefaultHeaders(_props?: any): Headers {
        const defaultHeaders: Headers = {
            'Access-Control-Allow-Origin': '*',
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
        };

        return defaultHeaders;
    }

    protected static getHeaders(headers?: Headers): Headers {
        let defaultHeaders: Headers = this.getDefaultHeaders();

        if (headers) {
            defaultHeaders = {
                ...defaultHeaders,
                ...headers,
            };
        }

        return defaultHeaders;
    }

    public static async get<
        T extends
            | JSONObject
            | JSONArray
            | BaseModel
            | Array<BaseModel>
            | AnalyticsBaseModel
            | Array<AnalyticsBaseModel>
    >(
        url: URL,
        data?: JSONObject | JSONArray,
        headers?: Headers
    ): Promise<HTTPResponse<T> | HTTPErrorResponse> {
        return await this.fetch<T>(HTTPMethod.GET, url, data, headers);
    }

    public static async delete<
        T extends
            | JSONObject
            | JSONArray
            | BaseModel
            | Array<BaseModel>
            | AnalyticsBaseModel
            | Array<AnalyticsBaseModel>
    >(
        url: URL,
        data?: JSONObject | JSONArray,
        headers?: Headers
    ): Promise<HTTPResponse<T> | HTTPErrorResponse> {
        return await this.fetch(HTTPMethod.DELETE, url, data, headers);
    }

    public static async head<
        T extends
            | JSONObject
            | JSONArray
            | BaseModel
            | Array<BaseModel>
            | AnalyticsBaseModel
            | Array<AnalyticsBaseModel>
    >(
        url: URL,
        data?: JSONObject | JSONArray,
        headers?: Headers
    ): Promise<HTTPResponse<T> | HTTPErrorResponse> {
        return await this.fetch(HTTPMethod.HEAD, url, data, headers);
    }

    public static async put<
        T extends
            | JSONObject
            | JSONArray
            | BaseModel
            | Array<BaseModel>
            | AnalyticsBaseModel
            | Array<AnalyticsBaseModel>
    >(
        url: URL,
        data?: JSONObject | JSONArray,
        headers?: Headers
    ): Promise<HTTPResponse<T> | HTTPErrorResponse> {
        return await this.fetch(HTTPMethod.PUT, url, data, headers);
    }

    public static async post<
        T extends
            | JSONObject
            | JSONArray
            | BaseModel
            | Array<BaseModel>
            | AnalyticsBaseModel
            | Array<AnalyticsBaseModel>
    >(
        url: URL,
        data?: JSONObject | JSONArray,
        headers?: Headers
    ): Promise<HTTPResponse<T> | HTTPErrorResponse> {
        return await this.fetch(HTTPMethod.POST, url, data, headers);
    }

    public static async fetch<
        T extends
            | JSONObject
            | JSONArray
            | BaseModel
            | Array<BaseModel>
            | AnalyticsBaseModel
            | Array<AnalyticsBaseModel>
    >(
        method: HTTPMethod,
        url: URL,
        data?: JSONObject | JSONArray,
        headers?: Headers,
        params?: Dictionary<string>
    ): Promise<HTTPResponse<T> | HTTPErrorResponse> {
        const apiHeaders: Headers = this.getHeaders(headers);

        if (params) {
            url.addQueryParams(params);
        }

        try {
            const finalHeaders: Dictionary<string> = {
                ...apiHeaders,
                ...headers,
            };

            let finalBody:
                | JSONObject
                | JSONArray
                | URLSearchParams
                | undefined = data;

            // if content-type is form-url-encoded, then stringify the data

            if (
                finalHeaders['Content-Type'] ===
                    'application/x-www-form-urlencoded' &&
                data
            ) {
                finalBody = new URLSearchParams(data as Dictionary<string>);
            }

            const result: AxiosResponse = await axios({
                method: method,
                url: url.toString(),
                headers: finalHeaders,
                data: finalBody,
            });

            result.headers = await this.onResponseSuccessHeaders(
                result.headers as Dictionary<string>
            );

            const response: HTTPResponse<T> = new HTTPResponse<T>(
                result.status,
                result.data,
                result.headers as Dictionary<string>
            );

            return response;
        } catch (e) {
            const error: Error | AxiosError = e as Error | AxiosError;
            let errorResponse: HTTPErrorResponse;
            if (axios.isAxiosError(error)) {
                // Do whatever you want with native error
                errorResponse = this.getErrorResponse(error);
            } else {
                throw new APIException(error.message);
            }

            this.handleError(errorResponse);
            return errorResponse;
        }
    }

    private static getErrorResponse(error: AxiosError): HTTPErrorResponse {
        if (error.response) {
            return new HTTPErrorResponse(
                error.response.status,
                error.response.data as JSONObject | JSONArray,
                error.response.headers as Dictionary<string>
            );
        }

        throw new APIException('Endpoint is not available');
    }
}
