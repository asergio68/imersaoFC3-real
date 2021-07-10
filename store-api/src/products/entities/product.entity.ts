import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'products' }) //nome da tabela
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image_url: string;

  @Column()
  slug: string;

  @Column()
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
