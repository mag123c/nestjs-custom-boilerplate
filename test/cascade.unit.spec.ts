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

    it('CASCADE INSERT:: 유저 엔터티 내부에서 포스트 엔터티를 같이 생성할 수 있다.', async () => {
        // given
        const post = postRepo.create({
            title: 'test',
            content: 'test',
        });

        const user = userRepo.create({
            name: 'test',
            email: 'test@test.com',
            posts: [post],
        });

        // when
        await userRepo.save(user);

        const userResult = await userRepo.find({ relations: ['posts'] });
        expect(userResult).toHaveLength(1);
        expect(userResult[0].posts).toHaveLength(1);
    });

    it('CASCADE UPDATE:: 유저의 isActive 상태 변경이 포스트에 전파된다.', async () => {
        // given
        const post = postRepo.create({
            title: 'test',
            content: 'test',
        });

        const user = userRepo.create({
            name: 'test',
            email: 'test@test.com',
            posts: [post],
        });

        // when
        await userRepo.save(user);

        // when
        const userResult = await userRepo.findOneOrFail({ where: { id: user.id }, relations: ['posts'] });
        userResult.deleted = true; // 유저 상태 변경
        if (userResult.posts) {
            userResult.posts[0].deleted = true; // 포스트 상태 변경
        }

        await userRepo.save(userResult);

        // then
        const postResult = await postRepo.findOneOrFail({ where: { id: post.id } });
        expect(postResult).toBeDefined();
        expect(postResult?.deleted).toBe(true);
    });

    it('CASCADE REMOVE:: 유저 엔터티를 삭제하면 포스트 엔터티도 같이 삭제된다.', async () => {
        // given
        const post = postRepo.create({
            title: 'test',
            content: 'test',
        });

        const user = userRepo.create({
            name: 'test',
            email: 'test@test.com',
            posts: [post],
        });
        await userRepo.save(user);

        // when
        await userRepo.remove(user);

        const userResult = await userRepo.find();
        const postResult = await postRepo.find();
        expect(userResult).toHaveLength(0);
        expect(postResult).toHaveLength(0);
    });

    it('CASCADE SOFT REMOVE:: 유저를 소프트 삭제하면 포스트도 소프트 삭제된다.', async () => {
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
        const fetchedUser = await userRepo.findOneOrFail({ where: { id: user.id }, relations: ['posts'] });
        await userRepo.softRemove(fetchedUser); // 소프트 삭제

        // then
        const allUsers = await userRepo.find();
        const allPosts = await postRepo.find();
        const userResult = await userRepo.find({ withDeleted: true });
        const postResult = await postRepo.find({ withDeleted: true });

        expect(allUsers).toHaveLength(0);
        expect(allPosts).toHaveLength(0);
        expect(userResult).toHaveLength(1);
        expect(postResult).toHaveLength(1);
    });
});
