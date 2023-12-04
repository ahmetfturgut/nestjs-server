import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from './email.service'; 
import { mailConfig } from 'src/core/environment/config';
import { join } from 'path'; 

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: mailConfig.mailHost,
                port: mailConfig.mailPort,
                secure: true,
                auth: {
                    user: mailConfig.mailUser,
                    pass: mailConfig.mailPassword,
                },
            },
            defaults: {
                from: '"No Reply" <no-reply@localhost>',
            }, 
            preview: true,
            template: { 
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }