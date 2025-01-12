import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import { AppModule } from '../src/app/app.module';
import { Post } from '../src/app/post/post.entity';
import { User } from '../src/app/user/user.entity';

describe('Test', () => {
    let app: INestApplication;
    let userRepo: Repository<User>;
    let postRepo: Repository<Post>;

    beforeAll(async () => {
        initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        userRepo = app.get<Repository<User>>(getRepositoryToken(User));
        postRepo = app.get<Repository<Post>>(getRepositoryToken(Post));
    });

    afterAll(async () => {
        await postRepo.delete({});
        await userRepo.delete({});
        await app.close();
    });

    it('INITIALLY DEFERRED:: 외래 키 제약 조건이 트랜잭션 커밋 시점에서 확인된다.', async () => {
        // given
        const post = postRepo.create({
            title: 'test',
            content: 'test',
        });

        const user = userRepo.create({
            name: 'test',
            email: 'test@test.com',
        });

        post.user = user;

        await userRepo.save(user);
        await postRepo.save(post);

        // when
        const queryRunner = userRepo.manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        // 부모 엔터티 삭제
        const fetchedUser = await userRepo.findOneOrFail({ where: { id: user.id }, relations: ['posts'] });
        await queryRunner.manager.remove(fetchedUser);

        // 트랜잭션 중간 상태에서 외래 키 무결성 위반 발생 여부 확인
        const remainingPosts = await queryRunner.manager.find(Post);
        expect(remainingPosts).toHaveLength(1); // 삭제되지 않은 상태 확인
        try {
            // 커밋 시도
            await queryRunner.commitTransaction(); // 여기서 외래 키 제약 조건 위반 발생
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                expect(error.message).toContain('foreign key constraint');
            } else {
                throw error;
            }
        } finally {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
        }
    });
});
