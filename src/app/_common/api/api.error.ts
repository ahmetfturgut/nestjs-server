//Her hatanın bir sebebi vardır...(Baran Basaran)
export class ApiError {

    constructor(private readonly errorCode: number, private readonly message: string) { }

    public getErrorCode(): number {
        return this.errorCode;
    }

    public getMessage(): string {
        return this.message;
    }

    //auth
    static readonly TOKEN_ERROR = new ApiError(101, 'Token error.');
    static readonly TOKEN_EXPIRED = new ApiError(102, 'Token expired.');
    static readonly TOKEN_BLOCKED = new ApiError(103, 'Token blocked.');
    static readonly DEFERRABLE_TOKEN_EXPIRED = new ApiError(104, 'Defferrable Token expired.');
    static readonly REQUIRED_TERMS_AND_CONDITIONS = new ApiError(105, 'Terms and conditions is required.');
    static readonly TOKEN_CODE_ERROR = new ApiError(106, 'Token code error.');

    // USER
    static readonly USER_EXISTS = new ApiError(201, 'User exists.');
    static readonly USER_EMAIL_EXISTS = new ApiError(202, 'User email exists.');

}