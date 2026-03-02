import { prisma } from './prisma';

export async function logAdminAction(
    adminId: number,
    action: string,
    targetType: string,
    targetId?: string | number,
    details?: any,
    req?: Request
) {
    try {
        let ip_address = null;
        if (req) {
            const forwarded = req.headers.get('x-forwarded-for');
            ip_address = forwarded ? forwarded.split(',')[0] : null;
        }

        await prisma.adminLog.create({
            data: {
                admin_id: adminId,
                action,
                target_type: targetType,
                target_id: targetId?.toString(),
                details: details ? (typeof details === 'string' ? details : JSON.stringify(details)) : null,
                ip_address,
            }
        });
    } catch (error) {
        console.error('[Logger] Failed to record admin log:', error);
        // We don't throw error to avoid breaking the main functionality
    }
}
