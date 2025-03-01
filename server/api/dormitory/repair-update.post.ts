import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface UpdateRepairBody {
  repairId: number
  status: 'pending' | 'in_progress' | 'completed'
  maintenanceId?: number
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody<UpdateRepairBody>(event)
    const { repairId, status, maintenanceId } = body

    await query(
      'UPDATE Repairs SET status = ?, maintenance_id = ? WHERE repair_id = ?',
      [status, maintenanceId || null, repairId]
    )

    return {
      code: 200,
      message: '更新维修状态成功'
    }
  } catch (error) {
    console.error('更新维修状态失败:', error)
    return {
      code: 500,
      message: '服务器错误'
    }
  }
})