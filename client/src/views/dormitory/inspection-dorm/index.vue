<template>
    <div class="page">
      <Breadcrumb :items="['宿舍中心', '宿舍检查']" />
      <a-card class="general-card" :header-style="{ display: 'none' }" :body-style="{ paddingTop: '20px' }">
        <div class="flex justify-between mb-6">
          <a-button type="primary" @click="openCreateModal">
            <template #icon>
              <icon-plus />
            </template>
            新增检查
          </a-button>
        </div>
        <a-table
          row-key="inspection_id"
          :loading="loading"
          :pagination="pagination"
          :data="renderData"
          :bordered="false"
          @page-change="onPageChange"
        >
          <template #columns>
            <a-table-column
              title="宿舍号"
              data-index="dorm_number"
            />
            <a-table-column
              title="所属楼栋"
              data-index="building_name"
            />
            <a-table-column
              title="检查人员"
              data-index="staff_name"
            />
            <a-table-column
              title="检查时间"
              data-index="inspection_time"
            >
              <template #cell="{ record }">
                {{ formatDate(record.inspection_time) }}
              </template>
            </a-table-column>
            <a-table-column
              title="检查结果"
              data-index="result"
            />
            <a-table-column
              title="备注"
              data-index="remarks"
            />
          </template>
        </a-table>
      </a-card>
  
      <InspectionForm
        v-model:visible="visible"
        @success="refreshInspectionList"
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { formatDate } from '@/utils/date'
  import { getInspectionList } from '@/api/dormitory-inspection'
  import type { InspectionInfo } from '@/api/dormitory-inspection'
  import InspectionForm from './components/inspection-form.vue'
  import { useRequest } from 'vue-hooks-plus'
  
  const visible = ref(false)
  const renderData = ref<InspectionInfo[]>([])
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0
  })
  
  // 获取检查记录列表
  const { loading, refresh: refreshInspectionList } = useRequest(getInspectionList, {
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