<template>
    <div class="page">
      <Breadcrumb :items="['宿舍中心', '维修管理']" />
      <a-card class="general-card" :header-style="{ display: 'none' }" :body-style="{ paddingTop: '20px' }">
        <div class="flex justify-between mb-6">
          <a-button type="primary" @click="openCreateModal">
            <template #icon>
              <icon-plus />
            </template>
            新增维修申请
          </a-button>
        </div>
        <a-table
          row-key="repair_id"
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
              title="维修描述"
              data-index="description"
            />
            <a-table-column
              title="状态"
              data-index="status"
            >
              <template #cell="{ record }">
                <a-tag :color="getStatusColor(record.status)">
                  {{ getStatusText(record.status) }}
                </a-tag>
              </template>
            </a-table-column>
            <a-table-column
              title="维修人员"
              data-index="maintenance_name"
            />
            <a-table-column
              title="申请时间"
              data-index="created_at"
            >
              <template #cell="{ record }">
                {{ formatDate(record.created_at) }}
              </template>
            </a-table-column>
            <a-table-column title="操作">
              <template #cell="{ record }">
                <a-button
                  v-if="record.status !== 'completed'"
                  type="text"
                  size="small"
                  @click="openUpdateModal(record)"
                  v-permission="['admin','maintenance','dorm_staff']"
                >
                  更新状态
                </a-button>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>
  
      <RepairForm
        v-model:visible="createVisible"
        @success="refreshRepairList"
      />
  
      <RepairUpdateForm
        v-model:visible="updateVisible"
        :repair-info="currentRepair"
        @success="refreshRepairList"
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { formatDate } from '@/utils/date'
  import { getRepairList } from '@/api/dormitory-repair'
  import type { RepairInfo } from '@/api/dormitory-repair'
  import RepairForm from './components/repair-form.vue'
  import RepairUpdateForm from './components/repair-update-form.vue'
  import { useRequest } from 'vue-hooks-plus'
  
  const createVisible = ref(false)
  const updateVisible = ref(false)
  const currentRepair = ref<RepairInfo>()
  const renderData = ref<RepairInfo[]>([])
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0
  })
  
  // 获取维修列表
  const { loading, refresh: refreshRepairList } = useRequest(getRepairList, {
    onSuccess(res) {
      if (res.code === 200) {
        renderData.value = res.data || []
        pagination.total = renderData.value.length
      }
    }
  })
  
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'orange',
      in_progress: 'blue',
      completed: 'green'
    }
    return colorMap[status] || 'gray'
  }
  
  const getStatusText = (status: string) => {
    const textMap: Record<string, string> = {
      pending: '待处理',
      in_progress: '处理中',
      completed: '已完成'
    }
    return textMap[status] || status
  }
  
  const openCreateModal = () => {
    createVisible.value = true
  }
  
  const openUpdateModal = (repair: RepairInfo) => {
    currentRepair.value = repair
    updateVisible.value = true
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