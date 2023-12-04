import { Language } from "src/app/_common/enum/language.enum";

export interface IEmailContent {
	subject: string;
	language:Language
	context: object;
	template: string;
	to: string;
   
}
