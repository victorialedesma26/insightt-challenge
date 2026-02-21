import { z } from 'zod';
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const taskFiltersSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        IN_PROGRESS: "IN_PROGRESS";
        DONE: "DONE";
        ARCHIVED: "ARCHIVED";
    }>>;
    search: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const statusTransitionSchema: z.ZodObject<{
    targetStatus: z.ZodEnum<{
        PENDING: "PENDING";
        IN_PROGRESS: "IN_PROGRESS";
        DONE: "DONE";
        ARCHIVED: "ARCHIVED";
    }>;
}, z.core.$strip>;
export declare const taskIdParamSchema: z.ZodObject<{
    taskId: z.ZodString;
}, z.core.$strip>;
