import type { ApiResponse } from '~~/types/api'
import type { StudentRow } from '~~/types/database'
import { query } from '~~/utils/db'

export default defineEventHandler(async (event): Promise<ApiResponse<StudentRow[]>> => {
  try {
    const dormId = Number(getRouterParam(event, 'id'))
    if (Number.isNaN(dormId)) {
      return {
        code: 400,
        message: '无效的宿舍ID',
      }
    }

    const students = await query<StudentRow[]>(`
      SELECT 
        u.user_id as student_id,
        u.username as student_number,
        u.real_name as name,
        1 as gender,
        u.contact as phone
      FROM Users u
      JOIN Student_Dorm sd ON u.user_id = sd.student_id
      WHERE sd.dorm_id = ?
    `, [dormId])

    return {
      code: 200,
      message: '获取宿舍学生列表成功',
      data: students || [],
    }
  }
  catch (error) {
    console.error('获取宿舍学生列表失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
