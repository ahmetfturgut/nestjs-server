export class CreateUserRequestDto {
    email: string;
    name: string;
    surname: string;
    password: string;

}


export class UpdateUserRequestDto {
    id: string
    email: string;
    name: string;
    surname: string;
    password: string;

}
