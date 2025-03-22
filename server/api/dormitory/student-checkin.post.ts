import type { ApiResponse } from '~~/types/api'
import { query, queryOne } from '~~/utils/db'

interface CheckinBody {
  studentId: number
  dormId: number
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody<CheckinBody>(event)
    const { studentId, dormId } = body

    // 检查学生是否已入住
    const existingCheckin = await queryOne(
      'SELECT * FROM Student_Dorm WHERE student_id = ?',
      [studentId],
    )

    if (existingCheckin) {
      return {
        code: 400,
        message: '该学生已入住宿舍',
      }
    }

    // 检查宿舍容量
    const [dorm] = await query(
      'SELECT d.*, COUNT(sd.id) as current_count FROM Dorms d LEFT JOIN Student_Dorm sd ON d.dorm_id = sd.dorm_id WHERE d.dorm_id = ? GROUP BY d.dorm_id',
      [dormId],
    )

    if (!dorm) {
      return {
        code: 404,
        message: '宿舍不存在',
      }
    }

    if (dorm.current_count >= dorm.capacity) {
      return {
        code: 400,
        message: '该宿舍已满员',
      }
    }

    // 创建入住记录
    await query(
      'INSERT INTO Student_Dorm (student_id, dorm_id) VALUES (?, ?)',
      [studentId, dormId],
    )

    return {
      code: 200,
      message: '入住登记成功',
    }
  }
  catch (error) {
    console.error('入住登记失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
