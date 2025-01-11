module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    ignorePatterns: ['*.js'],
    plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier', // Prettier 설정
        'plugin:prettier/recommended', // Prettier와 충돌 방지
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    settings: {
        'import/resolver': {
            typescript: {}, // TypeScript 경로 해석
        },
    },
    rules: {
        'prettier/prettier': [
            'error',
            {
                printWidth: 120, // 코드 줄 길이
                endOfLine: 'auto', // 운영체제 기본 줄바꿈 스타일 사용
            },
        ], // 코드 포맷 강제
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수 방지
        '@typescript-eslint/no-shadow': 'error', // 변수 이름 충돌 방지
        '@typescript-eslint/no-var-requires': 'error', // require 사용 금지
        '@typescript-eslint/consistent-type-imports': 'error', // 타입 임포트 일관성
        '@typescript-eslint/no-inferrable-types': 'off', // 명시적 타입을 요구하지 않음
        '@typescript-eslint/interface-name-prefix': 'off', // 인터페이스 이름 접두사 비활성화
        '@typescript-eslint/explicit-function-return-type': 'off', // 함수 반환 타입 명시 비활성화
        '@typescript-eslint/explicit-module-boundary-types': 'off', // 모듈 경계 타입 명시 비활성화
        '@typescript-eslint/no-explicit-any': 'off', // any 타입 허용
    },
};
