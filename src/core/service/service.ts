import { Document, Types as MongooseTypes } from 'mongoose';
import { Repository } from "../repository/repository";
import { BaseModel } from '../model/base.model';

export class Service<M extends BaseModel, D extends M & Document, R extends Repository<M, D>> {

    constructor(protected readonly repository: R) { }

    public async save(model: Partial<M>): Promise<M> {
        return this.repository.save(model);
    }

    async exists(filter: any): Promise<boolean> {
        return this.repository.exists(filter);
    }

    async existsById(id: string): Promise<boolean> {
        return this.repository.existsById(id);
    }

    public async find(filter: any): Promise<(M)[]> {
        return this.repository.find(filter);
    }

    public async findAll(): Promise<(M)[]> {
        return this.repository.findAll();
    }

    public async findOne(filter: any): Promise<M> {
        return this.repository.findOne(filter);
    }

    public async findById(id: string): Promise<M> {
        return this.repository.findById(id);
    }

    public async update(dto: M): Promise<M> {
        return this.repository.update(dto);
    }

}
