import { z } from 'zod';
export declare const signupInput: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const loginInput: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const courseInput: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    imageLink: z.ZodString;
    published: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    price: number;
    imageLink: string;
    published: boolean;
}, {
    title: string;
    description: string;
    price: number;
    imageLink: string;
    published: boolean;
}>;
export type signupInput = z.infer<typeof signupInput>;
export type loginInput = z.infer<typeof loginInput>;
export type courseInput = z.infer<typeof courseInput>;
