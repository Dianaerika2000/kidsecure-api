import { AuthorizedPerson } from "src/authorized-person/entities/authorized-person.entity";
import { Child } from "src/child/entities/child.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OutpuControl {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;


  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => Child, child => child.outputControls)
  child: Child;
  
  @ManyToOne(() => AuthorizedPerson, authorizedPerson => authorizedPerson.outputControls)
  authorizedPerson: AuthorizedPerson;
}
