import type { ApiResponse } from '~~/types/api'
import { insert } from '~~/utils/db'

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody(event)
    const { building_name, staff_id } = body

    await insert(
      'INSERT INTO Buildings (building_name, staff_id) VALUES (?, ?)',
      [building_name, staff_id]
    )

    return {
      code: 200,
      message: '创建宿舍楼成功'
    }
  } catch (error) {
    console.error('创建宿舍楼失败:', error)
    return {
      code: 500,
      message: '服务器错误'
    }
  }
})