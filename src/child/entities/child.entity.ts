import { AuthorizedPerson } from "src/authorized-person/entities/authorized-person.entity";
import { Classroom } from "src/classroom/entities/classroom.entity";
import { Father } from "src/father/entities/father.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToMany(
    () => Father,
    father => father.children,
    {cascade: true}
  )
  @JoinTable()
  fathers: Father[]; 

  @ManyToOne(
    () => Classroom,
    classroom => classroom.children,
  )
  classroom: Classroom;
}
