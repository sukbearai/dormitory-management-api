import type { ApiResponse } from '~~/types/api'
import { query, queryOne } from '~~/utils/db'

interface CheckoutBody {
  studentId: number
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody<CheckoutBody>(event)
    const { studentId } = body

    // 检查学生是否已入住
    const currentDorm = await queryOne(
      'SELECT * FROM Student_Dorm WHERE student_id = ?',
      [studentId]
    )

    if (!currentDorm) {
      return {
        code: 400,
        message: '该学生未入住宿舍'
      }
    }

    // 删除入住记录
    await query(
      'DELETE FROM Student_Dorm WHERE student_id = ?',
      [studentId]
    )

    return {
      code: 200,
      message: '退宿成功'
    }
  } catch (error) {
    console.error('退宿失败:', error)
    return {
      code: 500,
      message: '服务器错误'
    }
  }
})