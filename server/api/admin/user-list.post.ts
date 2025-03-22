import type { ApiResponse } from '~~/types/api'
import type { UserListResult, UserRow } from '~~/types/database'
import { query } from '~~/utils/db'

interface ListQuery {
  role?: UserRow['role']
  keyword?: string
}

export default defineEventHandler(async (event): Promise<ApiResponse<{
  total: number
  list: Omit<UserRow, 'password'>[]
}>> => {
  try {
    const body = await readBody<ListQuery>(event)
    const { role, keyword } = body

    let whereClause = '1=1'
    const params: any[] = []

    if (role) {
      whereClause += ' AND role = ?'
      params.push(role)
    }

    if (keyword) {
      whereClause += ' AND (username LIKE ? OR real_name LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }

    // 获取总数
    const [countResult] = await query<UserListResult[]>(
      `SELECT COUNT(*) as total FROM Users WHERE ${whereClause}`,
      params,
    )

    // 获取所有数据
    const users = await query<UserRow[]>(
      `SELECT user_id, username, password, role, real_name, contact, created_at, updated_at 
       FROM Users 
       WHERE ${whereClause}
       ORDER BY created_at DESC`,
      params,
    )

    return {
      code: 200,
      message: '获取用户列表成功',
      data: {
        total: countResult.total,
        list: users,
      },
    }
  }
  catch (error) {
    console.error('获取用户列表失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
