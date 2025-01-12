import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../post/post.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('increment', { unsigned: true })
    id!: number;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'varchar' })
    email!: string;

    @Column({ type: 'boolean', default: false })
    deleted!: boolean;

    @DeleteDateColumn({ type: 'datetime', precision: 0, nullable: true, default: null })
    deletedAt!: Date | null;

    @OneToMany(() => Post, (post) => post.user, { cascade: ['update'] })
    posts?: Post[];
}
