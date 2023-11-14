import { Child } from "src/child/entities/child.entity";
import { Person } from "src/person/entities/person.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AuthorizedPerson extends Person {
  @ManyToOne(
    () => Child,
    child => child.authorizedPersons,
  )
  child: Child;
}
