<template>
    <div class="page">
      <Breadcrumb :items="['宿舍中心', '宿舍管理']" />
      <a-card class="general-card" :header-style="{ display: 'none' }" :body-style="{ paddingTop: '20px' }">
        <div class="flex justify-between mb-6">
          <a-button type="primary" @click="openCreateModal">
            <template #icon>
              <icon-plus />
            </template>
            新增宿舍
          </a-button>
        </div>
        <a-table
          row-key="dorm_id"
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
              title="容量"
              data-index="capacity"
            />
            <a-table-column
              title="创建时间"
              data-index="created_at"
            >
              <template #cell="{ record }">
                {{ formatDate(record.created_at) }}
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
                    @click="openEditModal(record)"
                  >
                    编辑
                  </a-button>
                  <a-button
                    type="text"
                    size="small"
                    @click="openDetailModal(record)"
                  >
                    查看详情
                  </a-button>
                  <a-popconfirm content="确认删除该宿舍吗？" @ok="handleDelete(record)">
                    <a-button
                      type="text"
                      status="danger"
                      size="small"
                    >
                      删除
                    </a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </a-card>
  
      <DormForm
        v-model:visible="visible"
        :dorm="currentDorm"
        @success="refreshDormList"
      />

      <DormDetail
        v-model:visible="detailVisible"
        :dorm-id="currentDormId"
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { Message } from '@arco-design/web-vue'
  import { formatDate } from '@/utils/date'
  import { getDormitoryList, deleteDormitory } from '@/api/dormitory'
  import type { DormRow } from '~~/types/database'
  import DormForm from './components/dorm-form.vue'
  import DormDetail from './components/dorm-detail.vue'
  import { useRequest } from 'vue-hooks-plus'
  
  const detailVisible = ref(false)
  const currentDormId = ref<number>()
  const visible = ref(false)
  const currentDorm = ref<DormRow | null>(null)
  const renderData = ref<DormRow[]>([])
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0
  })
  
  // 获取宿舍列表
  const { loading, refresh: refreshDormList } = useRequest(
    () => getDormitoryList(), 
    {
      onSuccess(res) {
        if (res.code === 200) {
          renderData.value = res.data || []
          pagination.total = renderData.value.length
        }
      }
    }
  )
  
  // 删除宿舍
  const { run: submitDeleteDorm } = useRequest(deleteDormitory, {
    manual: true,
    onSuccess(res) {
      if (res.code === 200) {
        Message.success('删除成功')
        refreshDormList()
      } else {
        Message.error(res.message)
      }
    },
    onError() {
      Message.error('删除失败')
    }
  })

  const openDetailModal = (record: DormRow) => {
    currentDormId.value = record.dorm_id
    detailVisible.value = true
  }
  
  const openCreateModal = () => {
    currentDorm.value = null
    visible.value = true
  }
  
  const openEditModal = (record: DormRow) => {
    currentDorm.value = record
    visible.value = true
  }
  
  const handleDelete = (record: DormRow) => {
    submitDeleteDorm(record.dorm_id)
  }
  
  const onPageChange = (current: number) => {
    pagination.current = current
    refreshDormList()
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