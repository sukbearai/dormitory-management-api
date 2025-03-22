import bcrypt from 'bcrypt'
import type { ApiResponse } from '~~/types/api'
import type { UserRow } from '~~/types/database'
import { insert, queryOne } from '~~/utils/db'

type AddUserBody = Pick<UserRow, 'username' | 'password' | 'role' | 'real_name' | 'contact'>

export default defineEventHandler<Promise<ApiResponse<{
  user_id: number
  username: string
  role: string
}>>>(async (event) => {
  try {
    const body = await readBody<AddUserBody>(event)
    const { username, password, role, real_name, contact } = body

    // 参数验证
    if (!username || !password || !role) {
      return {
        code: 400,
        message: '用户名、密码和角色不能为空',
      }
    }

    // 检查用户名是否已存在
    const existingUser = await queryOne<UserRow>(
      'SELECT username FROM Users WHERE username = ?',
      [username],
    )

    if (existingUser) {
      return {
        code: 400,
        message: '用户名已存在',
      }
    }

    // 密码加密
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // 插入新用户
    const userId = await insert(
      'INSERT INTO Users (username, password, role, real_name, contact) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, role, real_name || '', contact || ''],
    )

    return {
      code: 200,
      message: '添加用户成功',
      data: {
        user_id: userId,
        username,
        role,
      },
    }
  }
  catch (error) {
    console.error('添加用户失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
