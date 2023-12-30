import {z} from 'zod'

export const signupInput = z.object({
    username: z.string().min(6).max(20),
    password: z.string().min(4).max(20),
  });
  
  
export const loginInput = z.object({
    username: z.string().min(6).max(20),
    password: z.string().min(4).max(20),
  });
  
export const courseInput = z.object({
    title: z.string().min(2),
    description: z.string().min(12),
    price: z.number().min(1),
    imageLink: z.string().min(4),
    published: z.boolean(),
  });
  
export  type signupInput = z.infer<typeof signupInput>
export  type loginInput = z.infer<typeof loginInput>
export  type courseInput = z.infer<typeof courseInput>