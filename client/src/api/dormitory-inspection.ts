import type { HttpResponse } from '@/utils/request'
import { request } from '@/utils/request'

// 检查记录信息接口
export interface InspectionInfo {
  inspection_id: number
  dorm_number: string
  building_name: string
  staff_name: string
  inspection_time: Date
  result: string
  remarks: string
}

// 检查统计信息接口
export interface InspectionStats {
  total_inspections: number
  result_counts: {
    [key: string]: number
  }
  building_stats: {
    building_name: string
    inspection_count: number
  }[]
}

// 获取检查记录列表
export function getInspectionList() {
  return request<HttpResponse<InspectionInfo[]>>('/api/dormitory/inspection-list', {
    method: 'GET',
  })
}

// 创建检查记录
export function createInspection(data: {
  dormId: number
  staffId: number
  inspectionTime: string
  result: string
  remarks?: string
}) {
  return request<HttpResponse>('/api/dormitory/inspection-create', {
    method: 'POST',
    data,
  })
}

// 获取检查统计数据
export function getInspectionStats() {
  return request<HttpResponse<InspectionStats>>('/api/dormitory/inspection-stats', {
    method: 'GET',
  })
}
