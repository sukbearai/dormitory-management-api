<template>
    <div class="page">
      <Breadcrumb :items="['宿舍中心', '晚归记录']" />
      <a-card class="general-card" :header-style="{ display: 'none' }" :body-style="{ paddingTop: '20px' }">
        <div class="flex justify-between mb-6">
          <a-button type="primary" @click="openCreateModal">
            <template #icon>
              <icon-plus />
            </template>
            新增晚归记录
          </a-button>
        </div>
        <a-table
          row-key="late_id"
          :loading="loading"
          :pagination="pagination"
          :data="renderData"
          :bordered="false"
          @page-change="onPageChange"
        >
          <template #columns>
            <a-table-column
              title="学生姓名"
              data-index="student_name"
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
              title="晚归时间"
              data-index="return_time"
            >
              <template #cell="{ record }">
                {{ formatDate(record.return_time) }}
              </template>
            </a-table-column>
            <a-table-column
              title="晚归原因"
              data-index="reason"
            />
          </template>
        </a-table>
      </a-card>
  
      <LateReturnForm
        v-model:visible="visible"
        @success="refreshLateReturnList"
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { formatDate } from '@/utils/date'
  import { getLateReturnList } from '@/api/dormitory-late-return'
  import type { LateReturnInfo } from '@/api/dormitory-late-return'
  import LateReturnForm from './components/late-return-form.vue'
  import { useRequest } from 'vue-hooks-plus'
  
  const visible = ref(false)
  const renderData = ref<LateReturnInfo[]>([])
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0
  })
  
  // 获取晚归记录列表
  const { loading, refresh: refreshLateReturnList } = useRequest(getLateReturnList, {
    onSuccess(res) {
      if (res.code === 200) {
        renderData.value = res.data || []
        pagination.total = renderData.value.length
      }
    }
  })
  
  const openCreateModal = () => {
    visible.value = true
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