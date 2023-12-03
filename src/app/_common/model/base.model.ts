import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"; 
const mongooseLeanVirtuals= require ('mongoose-lean-virtuals'); 
@Schema()
export class HasId {
    id: string;
}

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
export class BaseModel extends HasId {

    @Prop()
    audit: AuditModel;
}

export function createSchema<TClass extends any = any>(target: Type<TClass>){
    let schema = SchemaFactory.createForClass(target); 

    schema.plugin(mongooseLeanVirtuals);

    return schema;
}

 