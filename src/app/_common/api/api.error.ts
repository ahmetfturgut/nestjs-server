//Her hatanın bir sebebi vardır...(Baran Basaran)
export class ApiError {

    constructor(private readonly errorCode: number, private readonly message: string) { }

    public getErrorCode(): number {
        return this.errorCode;
    }

    public getMessage(): string {
        return this.message;
    }
 
    static readonly USER_EXISTS = new ApiError(201, 'User exists.');
    static readonly USER_EMAIL_EXISTS = new ApiError(202, 'User email exists.');

}