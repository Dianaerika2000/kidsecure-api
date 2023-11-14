import { Child } from "src/child/entities/child.entity";
import { Person } from "src/person/entities/person.entity";
import { BeforeInsert, Column, Entity, ManyToMany } from "typeorm";

@Entity()
export class Father extends Person {
  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  address: string;

  @ManyToMany(
    () => Child,
    child => child.fathers,
  )
  children: Child[];

  @BeforeInsert()
  defaultPassword() {
    const ciValue = this.ci;
    this.password = ciValue;
  }
}
