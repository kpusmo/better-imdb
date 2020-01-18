import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ownerId: number;

    @Column()
    token: string;

    @Column()
    status: string;

    @Column()
    expirationDate: Date;

    @Column()
    lastRefreshDate: Date;

    @Column()
    numberOfRefreshes: number;

    @CreateDateColumn()
    dateCreated: Date;

    @UpdateDateColumn()
    dateModified: Date;
}
