// app/(docs)/product-stream/utils/validation.ts
import { productStreamUpdateSchema } from '../schemas';
import type { CompleteAnalysis, ProductStreamUpdate } from '../types';

export function validateStreamUpdate(data: unknown): {
    valid: boolean;
    data?: ProductStreamUpdate;
    errors?: string[];
} {
    try {
        const validated = productStreamUpdateSchema.parse(data);
        return {
            valid: true,
            data: validated as ProductStreamUpdate
        };
    } catch (err: any) {
        const errors = err.errors?.map((e: any) => e.message) || ['Invalid data structure'];
        return {
            valid: false,
            errors
        };
    }
}



export function validateAnalysis(analysis: CompleteAnalysis) {
    try {
        const validatedData = productStreamSchema.parse({
            timestamp: new Date().toISOString(),
            workItems: analysis.workItems.map(w => ({
                title: w.title,
                type: w.type,
                scope: w.scope,
                progress: w.progress,
                context: w.context,
                nextSteps: w.nextSteps
            })),
            session: analysis.session,
            health: analysis.health,
            stories: analysis.stories
        });
        return { valid: true, data: validatedData };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                valid: false,
                errors: error.errors.map(e => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            };
        }
        return { valid: false, errors: [{ path: 'unknown', message: 'Unknown validation error' }] };
    }
}