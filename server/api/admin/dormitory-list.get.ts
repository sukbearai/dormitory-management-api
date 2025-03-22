import type { ApiResponse } from '~~/types/api'
import type { DormRow } from '~~/types/database'
import { query } from '~~/utils/db'

export default defineEventHandler(async (): Promise<ApiResponse<DormRow[]>> => {
  try {
    const dorms = await query<DormRow[]>(`
      SELECT d.*, b.building_name 
      FROM Dorms d
      LEFT JOIN Buildings b ON d.build_id = b.build_id
      ORDER BY d.created_at DESC
    `)

    return {
      code: 200,
      message: '获取宿舍列表成功',
      data: dorms,
    }
  }
  catch (error) {
    console.error('获取宿舍列表失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
