import { Model, Document } from 'mongoose';
import { AuditModel, BaseModel } from '../model/base.model';

export class Repository<M extends BaseModel, D extends M & Document> {

    constructor(protected readonly mongoModel: Model<D>) { }

    async save(model: Partial<M>): Promise<M> { 

        const audit = new AuditModel();  
        model.audit = audit;
        const createdModel = new this.mongoModel(model); 
        return createdModel.save();
    }

    async exists(filter: any): Promise<boolean> {
        filter = filter || {};
        let result = await this.mongoModel.findOne(filter).exec();
        return !!result;
    }

    async existsById(id: string): Promise<boolean> {
        return this.exists({ id: id });
    }

    async find(filter: any): Promise<(M)[]> {
        filter = filter || {};
        return this.mongoModel.find(filter).exec();
    }

    async findAll(): Promise<(M)[]> {
        return this.mongoModel.find().exec();
    }

    async findOne(filter: any): Promise<M> {
        filter = filter || {};
        return this.mongoModel.findOne(filter).exec();
    }

    async findById(id: string): Promise<M> {
        return this.mongoModel.findById(id).exec();
    }


    async update(dto: M): Promise<M> {

        return await this.mongoModel
            .findByIdAndUpdate(dto.id, dto, { new: true })
            .exec();
    }

}
