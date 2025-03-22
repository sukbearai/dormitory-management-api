import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface DeleteBuildingBody {
  buildId: number
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody<DeleteBuildingBody>(event)
    const { buildId } = body

    // 检查是否为管理员
    const user = event.context.user
    if (user?.role !== 'admin') {
      return {
        code: 403,
        message: '无权限执行此操作',
      }
    }

    // 检查是否存在关联的宿舍
    const [dormCount] = await query(
      'SELECT COUNT(*) as count FROM Dorms WHERE build_id = ?',
      [buildId],
    )

    if (dormCount.count > 0) {
      return {
        code: 400,
        message: '该楼栋下还有宿舍，无法删除',
      }
    }

    // 删除楼栋
    await query('DELETE FROM Buildings WHERE build_id = ?', [buildId])

    return {
      code: 200,
      message: '删除楼栋成功',
    }
  }
  catch (error) {
    console.error('删除楼栋失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
