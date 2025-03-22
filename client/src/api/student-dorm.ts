import type { HttpResponse } from '@/utils/request'
import { request } from '@/utils/request'

export interface StudentDormInfo {
  student_id: number
  username: string
  real_name: string | null
  contact: string | null
  dorm_id: number
  dorm_number: string
  building_name: string
  checkin_time: Date
}

// 获取学生住宿信息列表
export function getStudentDormList() {
  return request<HttpResponse<StudentDormInfo[]>>('/api/dormitory/student-dorm', {
    method: 'GET',
  })
}

// 学生入住登记
export function studentCheckin(data: {
  studentId: number
  dormId: number
}) {
  return request<HttpResponse>('/api/dormitory/student-checkin', {
    method: 'POST',
    data,
  })
}

// 学生调宿
export function changeStudentDorm(data: {
  studentId: number
  newDormId: number
}) {
  return request<HttpResponse>('/api/dormitory/student-change-dorm', {
    method: 'POST',
    data,
  })
}

// 学生退宿
export function studentCheckout(studentId: number) {
  return request<HttpResponse>('/api/dormitory/student-checkout', {
    method: 'POST',
    data: { studentId },
  })
}
