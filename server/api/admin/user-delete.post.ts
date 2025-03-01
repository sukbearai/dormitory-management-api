import type { ApiResponse } from '~~/types/api'
import type { UserRow } from '~~/types/database'
import { query } from '~~/utils/db'

interface DeleteUserBody {
  userId: number
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody<DeleteUserBody>(event)
    const { userId } = body

    // 检查是否为管理员
    const user = event.context.user
    if (user?.role !== 'admin') {
      return {
        code: 403,
        message: '无权限执行此操作'
      }
    }

    // 不允许删除管理员账号
    const [targetUser] = await query<UserRow[]>(
      'SELECT * FROM Users WHERE user_id = ?',
      [userId]
    )

    if (targetUser && targetUser?.role === 'admin' && targetUser?.username === 'admin') {
      return {
        code: 400,
        message: '不能删除管理员账号'
      }
    }

    await query('DELETE FROM Users WHERE user_id = ?', [userId])

    return {
      code: 200,
      message: '删除用户成功'
    }
  } catch (error) {
    console.error('删除用户失败:', error)
    return {
      code: 500,
      message: '服务器错误'
    }
  }
})