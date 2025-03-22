import type { RowDataPacket } from 'mysql2'
import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface RepairInfo extends RowDataPacket {
  repair_id: number
  student_name: string
  dorm_number: string
  building_name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  maintenance_name: string | null
  created_at: Date
  updated_at: Date
}

export default defineEventHandler(async (): Promise<ApiResponse<RepairInfo[]>> => {
  try {
    const repairs = await query<RepairInfo[]>(`
      SELECT 
        r.repair_id,
        u1.real_name as student_name,
        d.dorm_number,
        b.building_name,
        r.description,
        r.status,
        u2.real_name as maintenance_name,
        r.created_at,
        r.updated_at
      FROM Repairs r
      JOIN Users u1 ON r.student_id = u1.user_id
      JOIN Dorms d ON r.dorm_id = d.dorm_id
      JOIN Buildings b ON d.build_id = b.build_id
      LEFT JOIN Users u2 ON r.maintenance_id = u2.user_id
      ORDER BY r.created_at DESC
    `)

    return {
      code: 200,
      message: '获取维修列表成功',
      data: repairs,
    }
  }
  catch (error) {
    console.error('获取维修列表失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
