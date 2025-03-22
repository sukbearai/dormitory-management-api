import type { ApiResponse } from '~~/types/api'
import { query, queryOne } from '~~/utils/db'

interface DeleteNotificationBody {
  notification_id: number
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const user = event.context.user
    const userId = event.context.userId
    const body = await readBody<DeleteNotificationBody>(event)
    const { notification_id } = body

    if (!user || user.role !== 'dorm_staff') {
      return {
        code: 403,
        message: '只有宿管员可以删除通知',
      }
    }

    // 验证该通知是否属于当前宿管员
    const notification = await queryOne(
      'SELECT * FROM Notifications WHERE notification_id = ? AND staff_id = ?',
      [notification_id, userId],
    )

    if (!notification) {
      return {
        code: 403,
        message: '您没有权限删除该通知',
      }
    }

    await query(
      'DELETE FROM Notifications WHERE notification_id = ?',
      [notification_id],
    )

    return {
      code: 200,
      message: '删除通知成功',
    }
  }
  catch (error) {
    console.error('删除通知失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
