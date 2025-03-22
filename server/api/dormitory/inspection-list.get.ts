import type { RowDataPacket } from 'mysql2'
import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface InspectionInfo extends RowDataPacket {
  inspection_id: number
  dorm_number: string
  building_name: string
  staff_name: string
  inspection_time: Date
  result: string
  remarks: string
}

export default defineEventHandler(async (): Promise<ApiResponse<InspectionInfo[]>> => {
  try {
    const inspections = await query<InspectionInfo[]>(`
      SELECT 
        di.inspection_id,
        d.dorm_number,
        b.building_name,
        u.real_name as staff_name,
        di.inspection_time,
        di.result,
        di.remarks
      FROM Dorm_Inspections di
      JOIN Dorms d ON di.dorm_id = d.dorm_id
      JOIN Buildings b ON d.build_id = b.build_id
      JOIN Users u ON di.staff_id = u.user_id
      ORDER BY di.inspection_time DESC
    `)

    return {
      code: 200,
      message: '获取检查记录成功',
      data: inspections,
    }
  }
  catch (error) {
    console.error('获取检查记录失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
