import { AuthorizedPerson } from "src/authorized-person/entities/authorized-person.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  birthdate: Date;

  @Column('text')
  gender: string;

  @Column('text')
  allergies: string;

  @OneToMany(
    () => AuthorizedPerson, 
    authorizedPerson => authorizedPerson.child,
    {cascade: true, eager: true}  
  )
  authorizedPersons: AuthorizedPerson[];
}
