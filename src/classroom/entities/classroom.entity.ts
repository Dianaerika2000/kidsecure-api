import { Child } from 'src/child/entities/child.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @OneToMany(
    () => Child,
    child => child.classroom,
    {cascade: true, eager: true }
  )
  children?: Child[];
}
