export declare const ErrorCodes: {
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly AUTH_REQUIRED: "AUTH_REQUIRED";
    readonly INVALID_TOKEN: "INVALID_TOKEN";
    readonly TASK_NOT_FOUND: "TASK_NOT_FOUND";
    readonly ACCESS_DENIED: "ACCESS_DENIED";
    readonly INVALID_STATUS_TRANSITION: "INVALID_STATUS_TRANSITION";
    readonly STATUS_CONFLICT: "STATUS_CONFLICT";
    readonly TASK_LOCKED: "TASK_LOCKED";
    readonly CONCURRENT_UPDATE: "CONCURRENT_UPDATE";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
};
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
