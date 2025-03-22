import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface CreateInspectionBody {
  dormId: number
  staffId: number
  inspectionTime: string
  result: string
  remarks?: string
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody<CreateInspectionBody>(event)
    const { dormId, staffId, inspectionTime, result, remarks } = body

    await query(
      'INSERT INTO Dorm_Inspections (dorm_id, staff_id, inspection_time, result, remarks) VALUES (?, ?, ?, ?, ?)',
      [dormId, staffId, inspectionTime, result, remarks || null],
    )

    return {
      code: 200,
      message: '创建检查记录成功',
    }
  }
  catch (error) {
    console.error('创建检查记录失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
