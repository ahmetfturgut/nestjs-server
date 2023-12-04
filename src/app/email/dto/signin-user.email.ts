import { IEmailBase } from "src/app/email/interface/email-base.abstract";
import { MAIL_ENUMS } from "../enum/mail.enum";
import { Language } from "src/app/_common/enum/language.enum";


export class SignInEmail implements IEmailBase {
    to: string;
    language: Language;
    subject: string = "Email Code Verification"
    nameSurname: string
    code: string;

    getTemplate(): string {
        return MAIL_ENUMS.MAIL_TEMPLATE_PATH.CODE_MAIL;
    }
}
