import type { RowDataPacket } from 'mysql2'
import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface RepairStats extends RowDataPacket {
  total_repairs: number
  status_counts: {
    pending: number
    in_progress: number
    completed: number
  }
  building_stats: {
    building_name: string
    repair_count: number
  }[]
  monthly_stats: {
    month: string
    repair_count: number
  }[]
}

export default defineEventHandler(async (): Promise<ApiResponse<RepairStats>> => {
  try {
    // 获取总维修数和各状态的统计
    const [totalStats] = await query(`
      SELECT 
        COUNT(*) as total_repairs,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count
      FROM Repairs
    `)

    // 获取各楼栋的维修统计
    const buildingStats = await query(`
      SELECT 
        b.building_name,
        COUNT(r.repair_id) as repair_count
      FROM Buildings b
      LEFT JOIN Dorms d ON b.build_id = d.build_id
      LEFT JOIN Repairs r ON d.dorm_id = r.dorm_id
      GROUP BY b.build_id, b.building_name
      ORDER BY repair_count DESC
    `)

    // 获取月度维修统计
    const monthlyStats = await query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as repair_count
      FROM Repairs
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `)

    const stats = {
      total_repairs: totalStats.total_repairs,
      status_counts: {
        pending: totalStats.pending_count,
        in_progress: totalStats.in_progress_count,
        completed: totalStats.completed_count,
      },
      building_stats: buildingStats.map(stat => ({
        building_name: stat.building_name,
        repair_count: stat.repair_count,
      })),
      monthly_stats: monthlyStats.map(stat => ({
        month: stat.month,
        repair_count: stat.repair_count,
      })),
    } as RepairStats

    return {
      code: 200,
      message: '获取维修统计成功',
      data: stats,
    }
  }
  catch (error) {
    console.error('获取维修统计失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
