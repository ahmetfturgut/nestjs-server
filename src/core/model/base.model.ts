import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";



 
export class AuditModel {
    @Prop({ default: Date.now })
    createdDate: Date;

    @Prop({ default: Date.now })
    updatedDate: Date;

    @Prop()
    createdUserId: string;

    @Prop()
    updatedUserId: string;;
}

@Schema()
export class BaseModel {

    @Prop()
    id: string;

    @Prop()
    audit: AuditModel;
}

export function createSchema<TClass extends any = any>(target: Type<TClass>) {
    let schema = SchemaFactory.createForClass(target);
    return schema;
}

