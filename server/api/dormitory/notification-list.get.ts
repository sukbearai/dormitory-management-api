import type { ApiResponse } from '~~/types/api'
import type { NotificationInfo } from '~~/types/database'
import { query } from '~~/utils/db'

export default defineEventHandler(async (event): Promise<ApiResponse<NotificationInfo[]>> => {
  try {
    const user = event.context.user
    const userId = event.context.userId

    let sql = `
      SELECT 
        n.*,
        u.real_name as staff_name,
        b.building_name
      FROM Notifications n
      LEFT JOIN Users u ON n.staff_id = u.user_id
      LEFT JOIN Buildings b ON n.building_id = b.build_id
    `
    const params: any[] = []

    if (user.role === 'student') {
      // 学生只能看到自己所在宿舍楼栋的通知
      sql += `
        WHERE EXISTS (
          SELECT 1
          FROM Student_Dorm sd
          JOIN Dorms d ON sd.dorm_id = d.dorm_id
          JOIN Buildings b ON d.build_id = b.build_id
          WHERE sd.student_id = ? AND b.build_id = n.building_id
        )
      `
      params.push(userId)
    }
    else if (user.role === 'dorm_staff') {
      // 宿管只能看到自己负责的楼栋的通知
      sql += ' WHERE EXISTS (SELECT 1 FROM Buildings WHERE staff_id = ? AND build_id = n.building_id)'
      params.push(userId)
    }

    sql += ' ORDER BY n.created_at DESC'

    const notifications = await query<NotificationInfo[]>(sql, params)

    return {
      code: 200,
      message: '获取通知列表成功',
      data: notifications,
    }
  }
  catch (error) {
    console.error('获取通知列表失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
