import { Child } from "src/child/entities/child.entity";
import { OutpuControl } from "src/outpu-control/entities/outpu-control.entity";
import { Person } from "src/person/entities/person.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AuthorizedPerson extends Person {
  @ManyToOne(
    () => Child,
    child => child.authorizedPersons,
  )
  child: Child;

  @OneToMany(
    () => OutpuControl,
    outputControl => outputControl.authorizedPerson
  )
  outputControls: OutpuControl[];
}
