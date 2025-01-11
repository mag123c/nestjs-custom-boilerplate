import { HttpStatus } from '@nestjs/common';

export enum HttpStatusMessage {
    OK = 'success',
    CREATED = 'created',
    ACCEPTED = 'accepted',
    NO_CONTENT = 'no content',
    PARTIAL_CONTENT = 'partial content',
}

export const HttpStatusInfo = {
    [HttpStatus.OK]: HttpStatusMessage.OK,
    [HttpStatus.CREATED]: HttpStatusMessage.CREATED,
    [HttpStatus.ACCEPTED]: HttpStatusMessage.ACCEPTED,
    [HttpStatus.NO_CONTENT]: HttpStatusMessage.NO_CONTENT,
    [HttpStatus.PARTIAL_CONTENT]: HttpStatusMessage.PARTIAL_CONTENT,
};
