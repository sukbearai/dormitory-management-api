import type { HttpResponse } from '@/utils/request'
import { request } from '@/utils/request'

// 维修工单信息接口
export interface RepairInfo {
  repair_id: number
  student_name: string
  dorm_number: string
  building_name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  maintenance_name: string | null
  created_at: Date
  updated_at: Date
}

// 维修统计信息接口
export interface RepairStats {
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

// 获取维修工单列表
export function getRepairList() {
  return request<HttpResponse<RepairInfo[]>>('/api/dormitory/repair-list', {
    method: 'GET',
  })
}

// 创建维修申请
export function createRepair(data: {
  studentId: number
  dormId: number
  description: string
}) {
  return request<HttpResponse>('/api/dormitory/repair-create', {
    method: 'POST',
    data,
  })
}

// 更新维修状态
export function updateRepair(data: {
  repairId: number
  status: 'pending' | 'in_progress' | 'completed'
  maintenanceId?: number
}) {
  return request<HttpResponse>('/api/dormitory/repair-update', {
    method: 'POST',
    data,
  })
}

// 获取维修统计数据
export function getRepairStats() {
  return request<HttpResponse<RepairStats>>('/api/dormitory/repair-stats', {
    method: 'GET',
  })
}
