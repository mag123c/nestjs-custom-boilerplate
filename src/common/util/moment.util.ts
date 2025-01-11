import moment from 'moment-timezone';

export const koreaTimeString = (date?: Date) => moment(date).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
