import type { RowDataPacket } from 'mysql2'
import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface StudentDormInfo extends RowDataPacket {
    student_id: number
    username: string
    real_name: string | null
    contact: string | null
    dorm_id: number
    dorm_number: string
    building_name: string
    checkin_time: Date
}

export default defineEventHandler(async (): Promise<ApiResponse<StudentDormInfo[]>> => {
  try {
    const students = await query<StudentDormInfo[]>(`
      SELECT 
        u.user_id as student_id,
        u.username,
        u.real_name,
        u.contact,
        d.dorm_id,
        d.dorm_number,
        b.building_name,
        sd.created_at as checkin_time
      FROM Users u
      JOIN Student_Dorm sd ON u.user_id = sd.student_id
      JOIN Dorms d ON sd.dorm_id = d.dorm_id
      JOIN Buildings b ON d.build_id = b.build_id
      WHERE u.role = 'student'
      ORDER BY sd.created_at DESC
    `)

    return {
      code: 200,
      message: '获取学生住宿信息成功',
      data: students
    }
  } catch (error) {
    console.error('获取学生住宿信息失败:', error)
    return {
      code: 500,
      message: '服务器错误'
    }
  }
})