//환경변수 검사
export const envConfig = () => {
    // const ENV: string[] = ['local', 'dev', 'production', 'test', 'staging'];
    return {
        // validationSchema: Joi.object({
        //     NODE_ENV: Joi.string().valid(...ENV),
        // }),
        isGlobal: true,
        envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
    };
};
