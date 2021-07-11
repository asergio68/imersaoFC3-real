import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private prRepo: Repository<Product>) {}

  create(createProductDto: CreateProductDto) {
    const product = this.prRepo.create(createProductDto);
    return this.prRepo.save(product);
  }

  findAll() {
    return this.prRepo.find();
  }

  async findOne(idOrSlug: string) {
    //uuid
    let product: Product;
    if (uuidValidate(idOrSlug)) {
      product = await this.prRepo.findOne(idOrSlug);
    } else {
      product = await this.prRepo.findOne({ slug: idOrSlug });
    }
    if (!product) {
      throw new EntityNotFoundError(Product, idOrSlug);
    }
    return product;
  }

  async update(idOrSlug: string, updateProductDto: UpdateProductDto) {
    const id = await this.getId(idOrSlug);
    const updateResult = await this.prRepo.update(id, updateProductDto);
    if (!updateResult.affected) {
      throw new EntityNotFoundError(Product, id);
    }
    return this.prRepo.findOne(id);
  }

  async remove(idOrSlug: string) {
    const id = await this.getId(idOrSlug);
    const deleteResult = await this.prRepo.delete(id);
    if (!deleteResult.affected) {
      throw new EntityNotFoundError(Product, id);
    }
  }

  async getId(idOrSlug: string) {
    let id: string;
    if (uuidValidate(idOrSlug)) {
      id = idOrSlug;
    } else {
      const p = await this.prRepo.findOne({ slug: idOrSlug });
      if (!p) {
        throw new EntityNotFoundError(Product, idOrSlug);
      }
      id = p.id;
    }
    return id;
  }
}
