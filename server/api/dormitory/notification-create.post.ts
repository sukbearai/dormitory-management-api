import type { ApiResponse } from '~~/types/api'
import type { BuildingRow } from '~~/types/database'
import { insert, queryOne } from '~~/utils/db'

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const user = event.context.user
    const userId = event.context.userId
    const body = await readBody(event)
    const { title, content, building_id } = body

    if (!user || user.role !== 'dorm_staff') {
      return {
        code: 403,
        message: '只有宿管员可以发送通知',
      }
    }

    // 验证宿管员是否负责该楼栋
    const building = await queryOne<BuildingRow>(
      'SELECT * FROM Buildings WHERE build_id = ? AND staff_id = ?',
      [building_id, userId],
    )

    if (!building) {
      return {
        code: 403,
        message: '您没有权限向该楼栋发送通知',
      }
    }

    await insert(
      'INSERT INTO Notifications (title, content, staff_id, building_id) VALUES (?, ?, ?, ?)',
      [title, content, userId, building_id],
    )

    return {
      code: 200,
      message: '创建通知成功',
    }
  }
  catch (error) {
    console.error('创建通知失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
