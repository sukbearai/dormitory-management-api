import type { RowDataPacket } from 'mysql2'
import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface LateReturnInfo extends RowDataPacket {
  late_id: number
  student_name: string
  dorm_number: string
  building_name: string
  return_time: Date
  reason: string | null
}

export default defineEventHandler(async (): Promise<ApiResponse<LateReturnInfo[]>> => {
  try {
    const lateReturns = await query<LateReturnInfo[]>(`
      SELECT 
        lr.late_id,
        u.real_name as student_name,
        d.dorm_number,
        b.building_name,
        lr.return_time,
        lr.reason
      FROM Late_Returns lr
      JOIN Users u ON lr.student_id = u.user_id
      JOIN Dorms d ON lr.dorm_id = d.dorm_id
      JOIN Buildings b ON d.build_id = b.build_id
      ORDER BY lr.return_time DESC
    `)

    return {
      code: 200,
      message: '获取晚归记录成功',
      data: lateReturns
    }
  } catch (error) {
    console.error('获取晚归记录失败:', error)
    return {
      code: 500,
      message: '服务器错误'
    }
  }
})