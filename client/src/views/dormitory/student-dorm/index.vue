<template>
    <div class="page">
      <Breadcrumb :items="['宿舍中心', '学生住宿']" />
      <a-card class="general-card" :header-style="{ display: 'none' }" :body-style="{ paddingTop: '20px' }">
        <div class="flex justify-between mb-6">
          <a-button type="primary" @click="openCreateModal">
            <template #icon>
              <icon-plus />
            </template>
            学生入住
          </a-button>
        </div>
        <a-table
          row-key="student_id"
          :loading="loading"
          :pagination="pagination"
          :data="renderData"
          :bordered="false"
          @page-change="onPageChange"
        >
          <template #columns>
            <a-table-column
              title="学生姓名"
              data-index="real_name"
            />
            <a-table-column
              title="联系方式"
              data-index="contact"
            />
            <a-table-column
              title="宿舍号"
              data-index="dorm_number"
            />
            <a-table-column
              title="所属楼栋"
              data-index="building_name"
            />
            <a-table-column
              title="入住时间"
              data-index="checkin_time"
            >
              <template #cell="{ record }">
                {{ formatDate(record.checkin_time) }}
              </template>
            </a-table-column>
            <a-table-column
              title="操作"
              data-index="operations"
            >
              <template #cell="{ record }">
                <a-space>
                  <a-button
                    type="text"
                    size="small"
                    @click="openChangeModal(record)"
                  >
                    调宿
                  </a-button>
                  <a-popconfirm content="确认办理退宿吗？" @ok="handleCheckout(record)">
                    <a-button
                      type="text"
                      status="danger"
                      size="small"
                    >
                      退宿
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>
  
      <StudentDormForm
        v-model:visible="visible"
        :type="formType"
        :student="currentStudent"
        @success="refreshStudentList"
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { Message } from '@arco-design/web-vue'
  import { formatDate } from '@/utils/date'
  import { getStudentDormList, studentCheckout } from '@/api/student-dorm'
  import type { StudentDormInfo } from '@/api/student-dorm'
  import StudentDormForm from './components/student-dorm-form.vue'
  import { useRequest } from 'vue-hooks-plus'
  
  const visible = ref(false)
  const formType = ref<'checkin' | 'change'>('checkin')
  const currentStudent = ref<StudentDormInfo | null>(null)
  const renderData = ref<StudentDormInfo[]>([])
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0
  })
  
  // 获取学生住宿列表
  const { loading, refresh: refreshStudentList } = useRequest(getStudentDormList, {
    onSuccess(res) {
      if (res.code === 200) {
        renderData.value = res.data || []
        pagination.total = renderData.value.length
      }
    }
  })
  
  // 退宿
  const { run: submitCheckout } = useRequest(studentCheckout, {
    manual: true,
    onSuccess(res) {
      if (res.code === 200) {
        Message.success('退宿成功')
        refreshStudentList()
      } else {
        Message.error(res.message)
      }
    },
    onError() {
      Message.error('退宿失败')
    }
  })
  
  const openCreateModal = () => {
    formType.value = 'checkin'
    currentStudent.value = null
    visible.value = true
  }
  
  const openChangeModal = (record: StudentDormInfo) => {
    formType.value = 'change'
    currentStudent.value = record
    visible.value = true
  }
  
  const handleCheckout = (record: StudentDormInfo) => {
    submitCheckout(record.student_id)
  }
  
  const onPageChange = (current: number) => {
    pagination.current = current
  }
  </script>
  
  <style scoped>
  .page {
    padding: 0 20px 20px 20px;
  }
  
  .general-card {
    margin-top: 16px;
  }
  </style>