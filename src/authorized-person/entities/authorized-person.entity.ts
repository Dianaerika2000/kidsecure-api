import { Child } from "src/child/entities/child.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AuthorizedPerson {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('text')
  name: string;

  @Column('text')
  cellphone: string;

  @Column('text', { unique: true })
  ci: string;

  @Column('text')
  img_url: string;

  @Column('text', { nullable: true })
  face_id: string;

  @ManyToOne(
    () => Child,
    child => child.authorizedPersons,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  child: Child;
}
