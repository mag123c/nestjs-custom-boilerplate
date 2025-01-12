import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('post')
export class Post {
    @PrimaryGeneratedColumn('increment', { unsigned: true })
    id!: number;

    @Column({ type: 'varchar' })
    title!: string;

    @Column({ type: 'text' })
    content!: string;

    @Column({ type: 'boolean', default: false })
    deleted!: boolean;

    @DeleteDateColumn({ type: 'datetime', precision: 0, nullable: true, default: null })
    deletedAt!: Date | null;

    @ManyToOne(() => User, (user) => user.posts, {
        persistence: false,
    })
    user!: User | null;
}
