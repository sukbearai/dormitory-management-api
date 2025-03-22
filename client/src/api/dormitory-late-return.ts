import type { HttpResponse } from '@/utils/request'
import { request } from '@/utils/request'

// 晚归记录信息接口
export interface LateReturnInfo {
  late_id: number
  student_name: string
  dorm_number: string
  building_name: string
  return_time: Date
  reason: string | null
}

// 晚归统计信息接口
export interface LateReturnStats {
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

// 获取晚归记录列表
export function getLateReturnList() {
  return request<HttpResponse<LateReturnInfo[]>>('/api/dormitory/late-return-list', {
    method: 'GET',
  })
}

// 创建晚归记录
export function createLateReturn(data: {
  studentId: number
  dormId: number
  returnTime: string
  reason?: string
}) {
  return request<HttpResponse>('/api/dormitory/late-return-create', {
    method: 'POST',
    data,
  })
}

// 获取晚归统计数据
export function getLateReturnStats() {
  return request<HttpResponse<LateReturnStats>>('/api/dormitory/late-return-stats', {
    method: 'GET',
  })
}
