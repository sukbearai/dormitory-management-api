import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface CreateRepairBody {
  studentId: number
  dormId: number
  description: string
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody<CreateRepairBody>(event)
    const { studentId, dormId, description } = body

    await query(
      'INSERT INTO Repairs (student_id, dorm_id, description) VALUES (?, ?, ?)',
      [studentId, dormId, description],
    )

    return {
      code: 200,
      message: '维修申请创建成功',
    }
  }
  catch (error) {
    console.error('创建维修申请失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
