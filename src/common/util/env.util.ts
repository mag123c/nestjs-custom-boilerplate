export function isProduction() {
    return process.env.NODE_ENV === 'production';
}

export function isStaging() {
    return process.env.NODE_ENV === 'staging';
}

export function isDev() {
    return process.env.NODE_ENV === 'dev';
}

export function isLocal() {
    return process.env.NODE_ENV === 'local';
}

export function isTest() {
    return process.env.NODE_ENV === 'test';
}
