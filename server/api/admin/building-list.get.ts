import type { ApiResponse } from '~~/types/api'
import type { BuildingRow } from '~~/types/database'
import { query } from '~~/utils/db'

export default defineEventHandler(async (): Promise<ApiResponse<BuildingRow[]>> => {
  try {
    const buildings = await query<BuildingRow[]>(`
      SELECT b.*, u.real_name as staff_name 
      FROM Buildings b 
      LEFT JOIN Users u ON b.staff_id = u.user_id
      ORDER BY b.build_id DESC
    `)

    return {
      code: 200,
      message: '获取宿舍楼列表成功',
      data: buildings,
    }
  }
  catch (error) {
    console.error('获取宿舍楼列表失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
