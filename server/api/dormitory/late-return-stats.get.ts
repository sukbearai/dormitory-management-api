import type { RowDataPacket } from 'mysql2'
import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface LateReturnStats extends RowDataPacket {
  total_late_returns: number
  student_stats: {
    student_name: string
    late_count: number
  }[]
  building_stats: {
    building_name: string
    late_count: number
  }[]
  monthly_stats: {
    month: string
    late_count: number
  }[]
}

export default defineEventHandler(async (): Promise<ApiResponse<LateReturnStats>> => {
  try {
    // 获取总晚归次数
    const [totalStats] = await query<(RowDataPacket & { total_late_returns: number })[]>(`
      SELECT COUNT(*) as total_late_returns
      FROM Late_Returns
    `)

    // 获取学生晚归统计
    const studentStats = await query<(RowDataPacket & { student_name: string, late_count: number })[]>(`
      SELECT 
        u.real_name as student_name,
        COUNT(lr.late_id) as late_count
      FROM Users u
      JOIN Late_Returns lr ON u.user_id = lr.student_id
      GROUP BY u.user_id, u.real_name
      ORDER BY late_count DESC
      LIMIT 10
    `)

    // 获取楼栋晚归统计
    const buildingStats = await query<(RowDataPacket & { building_name: string, late_count: number })[]>(`
      SELECT 
        b.building_name,
        COUNT(lr.late_id) as late_count
      FROM Buildings b
      JOIN Dorms d ON b.build_id = d.build_id
      JOIN Late_Returns lr ON d.dorm_id = lr.dorm_id
      GROUP BY b.build_id, b.building_name
      ORDER BY late_count DESC
    `)

    // 获取月度晚归统计
    const monthlyStats = await query<(RowDataPacket & { month: string, late_count: number })[]>(`
      SELECT 
        DATE_FORMAT(return_time, '%Y-%m') as month,
        COUNT(*) as late_count
      FROM Late_Returns
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `)

    const stats: LateReturnStats = {
      total_late_returns: totalStats.total_late_returns,
      student_stats: studentStats,
      building_stats: buildingStats,
      monthly_stats: monthlyStats,
    } as LateReturnStats

    return {
      code: 200,
      message: '获取晚归统计成功',
      data: stats,
    }
  }
  catch (error) {
    console.error('获取晚归统计失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
