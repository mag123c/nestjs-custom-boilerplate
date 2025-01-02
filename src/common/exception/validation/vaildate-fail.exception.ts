import { BaseException } from '../base.exception';
import { EXCEPTION_CODE, EXCEPTION_DETAILS } from '../constant/exception.constants.';

/**
 * @Code 400001
 * @summary 커스텀 유효성 검사에 하나 이상 실패할 때 (class-validator를 사용하지 않을 경우)
 */
export class ValidateFailException extends BaseException {
    constructor(message?: string) {
        const code = EXCEPTION_CODE.VALIDATE_FAIL;
        super(400, code, message ?? EXCEPTION_DETAILS[code].message);
    }
}
