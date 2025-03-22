import type { ApiResponse } from '~~/types/api'
import { query, queryOne } from '~~/utils/db'

interface RateRepairBody {
  repairId: number
  rating: number
  comment: string
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const user = event.context.user
    const userId = event.context.userId
    const body = await readBody<RateRepairBody>(event)
    const { repairId, rating, comment } = body

    // 验证用户权限
    if (!user || user.role !== 'student') {
      return {
        code: 403,
        message: '只有学生可以评价维修',
      }
    }

    // 验证维修记录是否存在且属于该学生
    const repair = await queryOne(
      'SELECT * FROM Repairs WHERE repair_id = ? AND student_id = ? AND status = "completed"',
      [repairId, userId],
    )

    if (!repair) {
      return {
        code: 404,
        message: '维修记录不存在或未完成',
      }
    }

    // 检查是否已经评价过
    if (repair.rating) {
      return {
        code: 400,
        message: '该维修记录已评价',
      }
    }

    // 更新维修记录，添加评价信息
    await query(
      'UPDATE Repairs SET rating = ?, comment = ?, rated_at = NOW(), updated_at = NOW() WHERE repair_id = ?',
      [rating, comment, repairId],
    )

    return {
      code: 200,
      message: '评价成功',
    }
  }
  catch (error) {
    console.error('评价失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
