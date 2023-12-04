import { Language } from "../../_common/enum/language.enum";
import { IEmailBase } from "./email-base.abstract";
import { IEmailContent } from "./email-content";



export class EmailBuilder<D extends IEmailBase> { 

    constructor(public emailData: D) { }
    public async build(): Promise<IEmailContent> {

        let result: IEmailContent = {
            subject: this.emailData.subject,
            context: this.emailData,
            language: this.emailData.language,
            template: this.emailData.getTemplate(),
            to: this.emailData.to,
        };

        return result;
    }
}