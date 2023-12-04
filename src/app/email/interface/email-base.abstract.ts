import { Language } from "src/app/_common/enum/language.enum";


export interface IEmailBase {
    to: string;
    subject: string;
    language: Language;
    getTemplate(): string;
}

