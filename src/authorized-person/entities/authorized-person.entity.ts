import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
