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

    it('orphanedRowAction: nullify', async () => {
        // given
        const post = postRepo.create({
            title: 'test',
            content: 'test',
        });

        const user = userRepo.create({
            name: 'test',
            email: 'test@test.com',
        });

        user.posts = await postRepo.find();
        await userRepo.save(user);

        post.user = user;
        await postRepo.save(post);

        const fetchedPost = await postRepo.findOneOrFail({ where: { title: post.title }, relations: ['user'] });

        // when: 부모-자식 관계 끊기
        user.posts = [];
        await userRepo.save(user);

        // then
        expect(fetchedPost.user).not.toBeNull();
        expect(fetchedPost.user?.name).toBe(user.name);

        const removedPost = await postRepo.findOneOrFail({ where: { title: post.title }, relations: ['user'] });
        expect(removedPost.user).toBeNull();
    });

    it('orphanedRowAction: delete', async () => {
        // given
        const post = postRepo.create({
            title: 'test',
            content: 'test',
        });

        const user = userRepo.create({
            name: 'test',
            email: 'test@test.com',
        });

        user.posts = await postRepo.find();
        await userRepo.save(user);

        post.user = user;
        await postRepo.save(post);

        const fetchedPost = await postRepo.find();

        // when: 부모-자식 관계 끊기
        user.posts = [];
        await userRepo.save(user);

        // then: 자식 엔터티가 삭제되었는지 확인
        const removedPost = await postRepo.find();
        expect(fetchedPost.length).toBe(1);
        expect(removedPost.length).toBe(0);
    });

    it.only('orphanedRowAction: soft-delete', async () => {
        // given
        const post = postRepo.create({
            title: 'test',
            content: 'test',
        });

        const user = userRepo.create({
            name: 'test',
            email: 'test@test.com',
        });

        user.posts = await postRepo.find();
        await userRepo.save(user);

        post.user = user;
        await postRepo.save(post);

        const fetchedPost = await postRepo.find();

        // when: 부모-자식 관계 끊기
        user.posts = [];
        await userRepo.save(user);

        // then: 자식 엔터티가 조회되지 않는지 확인.
        const removedPost = await postRepo.find();
        const whithDeletedPost = await postRepo.find({ withDeleted: true });

        expect(fetchedPost.length).toBe(1);
        expect(removedPost.length).toBe(0);

        expect(whithDeletedPost.length).toBe(1);
    });
});
