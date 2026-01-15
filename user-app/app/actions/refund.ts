'use server';

import { adminAuthClient } from '@/lib/admin';
import { revalidatePath } from 'next/cache';

export async function refundOrder(orderId: string, note: string) {
    if (!adminAuthClient) {
        return {
            success: false,
            message: "系統設定錯誤：缺少管理員金鑰 (Service Role Key)。請聯繫客服。"
        };
    }

    try {
        const { error } = await adminAuthClient
            .from('orders')
            .update({
                status: 'refund',
                note: note
            })
            .eq('id', orderId);

        if (error) {
            console.error("Refund Update Error:", error);
            return { success: false, message: "資料庫更新失敗：" + error.message };
        }

        revalidatePath('/dashboard');
        return { success: true };

    } catch (err: any) {
        console.error("Refund Action Error:", err);
        return { success: false, message: "伺服器錯誤：" + err.message };
    }
}
