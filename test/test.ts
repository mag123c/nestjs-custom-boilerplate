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
});
