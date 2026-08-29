/**
 * NOVA Core — Structured Logger
 * Centralised logging utility that prefixes every entry with [NOVA]
 * and attaches a context payload for easy filtering in dev/prod tools.
 *
 * Usage:
 *   import { logger } from '../utils/logger';
 *   logger.error('workoutStore.finishSession', err, { uid, exerciseId });
 */

export type LogContext = Record<string, unknown>;

const PREFIX = '[NOVA]';

function format(tag: string, message: string): string {
    return `${PREFIX} [${tag}] ${message}`;
}

export const logger = {
    /**
     * Informational message — benign events worth tracking.
     */
    info(tag: string, message: string, context?: LogContext): void {
        console.info(format(tag, message), context ?? '');
    },

    /**
     * Warning — recoverable issues or unexpected-but-handled states.
     */
    warn(tag: string, message: string, context?: LogContext): void {
        console.warn(format(tag, message), context ?? '');
    },

    /**
     * Error — failed operations that affect the user.
     * Always logs the full Error object so the stack trace is preserved.
     */
    error(tag: string, err: unknown, context?: LogContext): void {
        const message =
            err instanceof Error ? err.message : String(err);
        const code =
            (err as any)?.code ?? (err as any)?.name ?? 'UNKNOWN';

        console.error(format(tag, `${message} (code: ${code})`), {
            ...context,
            errorCode: code,
            errorStack: err instanceof Error ? err.stack : undefined,
        });
    },
};
