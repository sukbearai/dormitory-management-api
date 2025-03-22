import type { ApiResponse } from '~~/types/api'
import type { DormRow } from '~~/types/database'
import { queryOne, update } from '~~/utils/db'

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody(event)
    const { dorm_id, dorm_number, capacity, build_id } = body

    // 检查宿舍是否存在
    const existingDorm = await queryOne<DormRow>(
      'SELECT * FROM Dorms WHERE dorm_id = ?',
      [dorm_id],
    )

    if (!existingDorm) {
      return {
        code: 404,
        message: '宿舍不存在',
      }
    }

    // 检查宿舍号是否被其他宿舍使用
    const duplicateDorm = await queryOne<DormRow>(
      'SELECT * FROM Dorms WHERE dorm_number = ? AND dorm_id != ?',
      [dorm_number, dorm_id],
    )

    if (duplicateDorm) {
      return {
        code: 400,
        message: '宿舍号已存在',
      }
    }

    await update(
      'UPDATE Dorms SET dorm_number = ?, capacity = ?, build_id = ? WHERE dorm_id = ?',
      [dorm_number, capacity, build_id, dorm_id],
    )

    return {
      code: 200,
      message: '更新宿舍成功',
    }
  }
  catch (error) {
    console.error('更新宿舍失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
