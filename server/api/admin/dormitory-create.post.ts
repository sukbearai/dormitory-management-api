import type { ApiResponse } from '~~/types/api'
import type { DormRow } from '~~/types/database'
import { insert, queryOne } from '~~/utils/db'

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody(event)
    const { dorm_number, capacity, build_id } = body

    // 检查宿舍号是否已存在
    const existingDorm = await queryOne<DormRow>(
      'SELECT dorm_number FROM Dorms WHERE dorm_number = ?',
      [dorm_number]
    )

    if (existingDorm) {
      return {
        code: 400,
        message: '宿舍号已存在'
      }
    }

    await insert(
      'INSERT INTO Dorms (dorm_number, capacity, build_id) VALUES (?, ?, ?)',
      [dorm_number, capacity, build_id]
    )

    return {
      code: 200,
      message: '创建宿舍成功'
    }
  } catch (error) {
    console.error('创建宿舍失败:', error)
    return {
      code: 500,
      message: '服务器错误'
    }
  }
})