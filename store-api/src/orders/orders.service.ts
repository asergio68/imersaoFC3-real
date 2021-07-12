import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Connection, In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { PaymentService } from './payment/payment.service';
// import { validate as uuidValidate } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private paymentService: PaymentService,
    private connection: Connection,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    console.log('service...');
    console.log(createOrderDto);

    const order = this.orderRepo.create(createOrderDto);
    console.log('service 1...');

    const products = await this.productRepo.find({
      where: {
        id: In(order.items.map((item) => item.product_id)),
      },
    });

    console.log('service 2...');

    order.items.forEach((item) => {
      const product = products.find(
        (product) => product.id === item.product_id,
      );
      item.price = product.price;
    });

    console.log('service 3...');

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newOrder = await queryRunner.manager.save(order);

      console.log('service 4...');

      await this.paymentService.payment({
        creditCard: {
          name: order.credit_card.name,
          number: order.credit_card.number,
          expirationMonth: order.credit_card.expiration_month,
          expirationYear: order.credit_card.expiration_year,
          cvv: order.credit_card.cvv,
        },
        amount: order.total,
        store: process.env.STORE_NAME,
        description: `Produtos: ${products.map((p) => p.name).join(', ')}`,
      });

      console.log('service 5...');

      await queryRunner.manager.update(
        Order,
        { id: newOrder.id },
        {
          status: OrderStatus.Approved,
        },
      );
      await queryRunner.commitTransaction();

      console.log('service 6...');

      return this.orderRepo.findOne(newOrder.id, { relations: ['items'] });
    } catch (e) {

      console.log('service 7...');

      await queryRunner.rollbackTransaction();
      console.log(e.name);
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const orders = await this.orderRepo.find();
    console.log(orders.length);
    return orders;
  }

  findOne(id: string) {
    return this.orderRepo.findOneOrFail(id, {
      relations: ['items', 'items.product'],
    });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
