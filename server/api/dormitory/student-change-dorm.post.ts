import type { ApiResponse } from '~~/types/api'
import { query, queryOne } from '~~/utils/db'

interface ChangeDormBody {
  studentId: number
  newDormId: number
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody<ChangeDormBody>(event)
    const { studentId, newDormId } = body

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

    // 检查新宿舍容量
    const [dorm] = await query(
      'SELECT d.*, COUNT(sd.id) as current_count FROM Dorms d LEFT JOIN Student_Dorm sd ON d.dorm_id = sd.dorm_id WHERE d.dorm_id = ? GROUP BY d.dorm_id',
      [newDormId]
    )

    if (!dorm) {
      return {
        code: 404,
        message: '宿舍不存在'
      }
    }

    if (dorm.current_count >= dorm.capacity) {
      return {
        code: 400,
        message: '该宿舍已满员'
      }
    }

    // 更新宿舍信息
    await query(
      'UPDATE Student_Dorm SET dorm_id = ? WHERE student_id = ?',
      [newDormId, studentId]
    )

    return {
      code: 200,
      message: '调宿成功'
    }
  } catch (error) {
    console.error('调宿失败:', error)
    return {
      code: 500,
      message: '服务器错误'
    }
  }
})