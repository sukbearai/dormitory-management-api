import bcrypt from 'bcrypt'
import type { ApiResponse } from '~~/types/api'
import type { UserRow } from '~~/types/database'
import { query } from '~~/utils/db'

interface UpdateUserBody {
  userId: number
  username: string
  password?: string
  role: UserRow['role']
  real_name?: string
  contact?: string
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody<UpdateUserBody>(event)
    const { userId, username, password, role, real_name, contact } = body

    // 检查用户是否存在
    const [existingUser] = await query<UserRow[]>(
      'SELECT * FROM Users WHERE user_id = ?',
      [userId],
    )

    if (!existingUser) {
      return {
        code: 404,
        message: '用户不存在',
      }
    }

    // 检查用户名是否已被其他用户使用
    const [duplicateUser] = await query<UserRow[]>(
      'SELECT * FROM Users WHERE username = ? AND user_id != ?',
      [username, userId],
    )

    if (duplicateUser) {
      return {
        code: 400,
        message: '用户名已存在',
      }
    }

    let sql = 'UPDATE Users SET username = ?, role = ?, real_name = ?, contact = ?'
    const params: any[] = [username, role, real_name || '', contact || '']

    // 如果提供了新密码，则更新密码
    if (password) {
      sql += ', password = ?'
      const hashedPassword = await bcrypt.hash(password, 10)
      params.push(hashedPassword)
    }

    sql += ' WHERE user_id = ?'
    params.push(userId)

    await query(sql, params)

    return {
      code: 200,
      message: '更新用户信息成功',
    }
  }
  catch (error) {
    console.error('更新用户信息失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
