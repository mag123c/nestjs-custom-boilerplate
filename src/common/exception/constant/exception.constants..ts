export enum EXCEPTION_CODE {
    VALIDATE_FAIL = '001',
}

export const EXCEPTION_DETAILS = {
    [EXCEPTION_CODE.VALIDATE_FAIL]: {
        message: 'Validation failed',
    },
};
