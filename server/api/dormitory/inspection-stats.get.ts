import type { RowDataPacket } from 'mysql2'
import type { ApiResponse } from '~~/types/api'
import { query } from '~~/utils/db'

interface InspectionStats extends RowDataPacket {
  total_inspections: number
  result_counts: {
    [key: string]: number
  }
  building_stats: {
    building_name: string
    inspection_count: number
  }[]
}

export default defineEventHandler(async (): Promise<ApiResponse<InspectionStats>> => {
  try {
    // 获取总检查数和各结果的统计
    const [totalStats] = await query(`
      SELECT 
        COUNT(*) as total_inspections,
        SUM(CASE WHEN result = '优秀' THEN 1 ELSE 0 END) as excellent_count,
        SUM(CASE WHEN result = '良好' THEN 1 ELSE 0 END) as good_count,
        SUM(CASE WHEN result = '合格' THEN 1 ELSE 0 END) as pass_count,
        SUM(CASE WHEN result = '不合格' THEN 1 ELSE 0 END) as fail_count
      FROM Dorm_Inspections
    `)

    // 获取各楼栋的检查统计
    const buildingStats = await query(`
      SELECT 
        b.building_name,
        COUNT(di.inspection_id) as inspection_count
      FROM Buildings b
      LEFT JOIN Dorms d ON b.build_id = d.build_id
      LEFT JOIN Dorm_Inspections di ON d.dorm_id = di.dorm_id
      GROUP BY b.build_id, b.building_name
      ORDER BY inspection_count DESC
    `)

    const stats: InspectionStats = {
      total_inspections: 0,
      ...totalStats,
      result_counts: {
        优秀: totalStats.excellent_count,
        良好: totalStats.good_count,
        合格: totalStats.pass_count,
        不合格: totalStats.fail_count,
      },
      building_stats: buildingStats.map(stat => ({
        building_name: stat.building_name,
        inspection_count: stat.inspection_count,
      })),
    }

    return {
      code: 200,
      message: '获取检查统计成功',
      data: stats,
    }
  }
  catch (error) {
    console.error('获取检查统计失败:', error)
    return {
      code: 500,
      message: '服务器错误',
    }
  }
})
