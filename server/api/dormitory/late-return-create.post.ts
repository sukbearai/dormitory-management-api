import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface CreateLateReturnBody {
  studentId: number
  dormId: number
  returnTime: string
  reason?: string
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody<CreateLateReturnBody>(event)
    const { studentId, dormId, returnTime, reason } = body

    await query(
      'INSERT INTO Late_Returns (student_id, dorm_id, return_time, reason) VALUES (?, ?, ?, ?)',
      [studentId, dormId, returnTime, reason || null],
    )

    return {
      code: 200,
      message: '晚归记录创建成功',
    }
  }
  catch (error) {
    console.error('创建晚归记录失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
