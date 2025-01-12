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

    describe('persistence: true', () => {
        it('persistence: false:: 정방향에서 관계 변경 시도를 할 경우 실패한다.', async () => {
            // given
            const user = userRepo.create({
                name: 'test user',
                email: 'test@test.com',
            });
            await userRepo.save(user);

            const post = postRepo.create({
                title: 'test post',
                content: 'test content',
                user,
            });

            await postRepo.save(post);

            // when: 역방향에서 관계 변경 시도
            user.posts = [];
            await userRepo.save(user);

            // then: 역방향에서 관계 변경
            const savedUser = await userRepo.findOneOrFail({ where: { id: user.id }, relations: ['posts'] });
            expect(savedUser.posts).toHaveLength(0);

            // when: 정방향에서 관계 변경 시도
            const newUser = userRepo.create({
                name: 'new user',
                email: 'new@new.com',
            });

            await userRepo.save(newUser);

            post.user = newUser;
            expect(post.user).toBe(newUser);
            await postRepo.save(post);

            // then: 정방향에서 관계 변경
            const savedPost = await postRepo.findOneOrFail({ where: { id: post.id }, relations: ['user'] });
            expect(savedPost.user).toBe(user);
        });
    });
});
