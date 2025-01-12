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

    it('createForeignKeyConstraints:: 외래 키 제약 조건을 생성하지 않는다. 논리적 관계는 유지되어 조회가 가능하다.', async () => {
        // given
        const user = userRepo.create({
            name: 'test',
            email: 'test@test.com',
        });

        await userRepo.save(user);

        const post = postRepo.create({
            title: 'test',
            content: 'test',
            user,
        });

        await postRepo.save(post);

        // when
        const fetchedPost = await postRepo.findOneOrFail({ where: { title: post.title } });
        const fetchedUser = await fetchedPost.user;

        // then
        expect(fetchedPost.title).toBe(post.title);
        expect(fetchedUser?.name).toBe(user.name);
    });
});
