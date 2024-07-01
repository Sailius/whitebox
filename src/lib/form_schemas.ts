import { z } from 'zod';

export const signSchema = z.object({
    username: z
        .string()
        .min(3, { message: 'Must be 3 or more characters long' })
        .max(31, { message: 'Must be 31 or less characters long' })
        .regex(/^[a-z_]+$/, { message: "Only lowercase english letters and '_' allowed" }),
    password: z
        .string()
        .min(6, { message: 'Must be 6 or more characters long' })
        .max(255, { message: 'Must be 255 or less characters long' })
        .regex(/(?=.*?[A-Z])/, { message: 'At least one capital english letter' })
        .regex(/(?=.*?[a-z])/, { message: 'At least one lowercase english letter' })
        .regex(/(?=.*?[0-9])/, { message: 'At least one digit' })
        .regex(/(?=.*?[#?!@$%^&*,.-])/, { message: 'At least one special symbol' })
});

export type SignSchema = typeof signSchema;

export const factorCodeSchema = z.object({
    code: z
        .string()
        .regex(/^\d+$/, { message: 'Must be a number' })
        .length(6, { message: 'Must contain 6 digits' })
});

export type FactorCodeSchema = typeof factorCodeSchema;

export const pfpSchema = z.object({
    angle: z.number().int().min(0).max(360),
    opacity1: z.number().int().min(0).max(100),
    opacity2: z.number().int().min(0).max(100),
    color1: z.string().regex(/^#[0-9A-F]{6}$/i),
    color2: z.string().regex(/^#[0-9A-F]{6}$/i)
});

export type PfpSchema = typeof pfpSchema;
