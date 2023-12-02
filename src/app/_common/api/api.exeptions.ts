//common exeptions to here!

import { HttpException, HttpStatus } from "@nestjs/common";
import { ApiError } from "./api.error";


export class ApiException extends HttpException {

    private apiErrorCode: number;
    private data : Map<string, string>;
    static API_EXEPTION_HTTP_STATUS = 555;
    
    constructor(apiErrorCode: number, response: string | Record<string, any>, data? : Map<string, string>) {
        super(response, ApiException.API_EXEPTION_HTTP_STATUS);
        this.apiErrorCode = apiErrorCode;
        this.data = data;
    }

    public getApiErrorCode() : number {
        return this.apiErrorCode;
    }

    public getData() : Array<{key : string, value: string}> {
        let result = new Array<{key : string, value: string}>();
        if(this.data) {
            for (let [key, value] of this.data) {
                result.push({
                    key: key,
                    value: value
                });
            }
    
            return result;    
        }
        return [];
    }

    static buildFromApiError(apiError: ApiError, data?: Map<string, string>) {
        if(data) {
            let message = apiError.getMessage();
            for (let [key, value] of data) {
                message = message.replace("{" + key + "}", value);
            }
            return new ApiException(apiError.getErrorCode(), message, data);

        } else {
            return new ApiException(apiError.getErrorCode(), apiError.getMessage());
        }
    }
}

