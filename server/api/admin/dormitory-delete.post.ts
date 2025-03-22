import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface DeleteDormitoryBody {
  dormId: number
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody<DeleteDormitoryBody>(event)
    const { dormId } = body

    // 检查是否为管理员
    const user = event.context.user
    if (user?.role !== 'admin') {
      return {
        code: 403,
        message: '无权限执行此操作',
      }
    }

    // 检查是否有学生入住
    const [studentCount] = await query(
      'SELECT COUNT(*) as count FROM Student_Dorm WHERE dorm_id = ?',
      [dormId],
    )

    if (studentCount.count > 0) {
      return {
        code: 400,
        message: '该宿舍还有学生入住，无法删除',
      }
    }

    await query('DELETE FROM Dorms WHERE dorm_id = ?', [dormId])

    return {
      code: 200,
      message: '删除宿舍成功',
    }
  }
  catch (error) {
    console.error('删除宿舍失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
