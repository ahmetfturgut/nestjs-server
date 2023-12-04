import { IEmailBase } from "src/app/email/interface/email-base.abstract";
import { MAIL_ENUMS } from "../enum/mail.enum";
import { Language } from "src/app/_common/enum/language.enum";


export class SignUpEmail implements IEmailBase {
    to: string;
    language: Language;
    subject: string = "Please enter the code to verify your account."
    nameSurname: string
    code: string;

    getTemplate(): string {
        return MAIL_ENUMS.MAIL_TEMPLATE_PATH.CONFIRMATION_SING_UP;
    }
}
