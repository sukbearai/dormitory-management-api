<template>
  <div class="page">
    <Breadcrumb :items="['宿舍中心', '通知管理']" />
    <a-card class="general-card" :header-style="{ display: 'none' }" :body-style="{ paddingTop: '20px' }">
      <div class="flex justify-between mb-6">
        <a-button v-permission="['dorm_staff']" type="primary" @click="openCreateModal">
          <template #icon>
            <icon-plus />
          </template>
          发布通知
        </a-button>
      </div>
      <a-table
        row-key="notification_id"
        :loading="loading"
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="标题" data-index="title" />
          <a-table-column title="内容" data-index="content" />
          <a-table-column title="发布人" data-index="staff_name" />
          <a-table-column title="所属楼栋" data-index="building_name" />
          <a-table-column title="发布时间" data-index="created_at">
            <template #cell="{ record }">
              {{ formatDate(record.created_at) }}
            </template>
          </a-table-column>
          <a-table-column v-permission="['dorm_staff']" title="操作" align="center">
            <template #cell="{ record }">
              <a-popconfirm
                content="确认删除该通知吗？"
                @ok="handleDelete(record)"
              >
                <a-button type="text" status="danger" size="small">
                  删除
                </a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>

    <notification-form
      v-model:visible="formVisible"
      @success="fetchNotifications"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { getNotificationList,deleteNotification } from '@/api/notification'
import { useUserStore } from '@/store'
import { formatDate } from '@/utils/date'
import type { NotificationInfo } from '~~/types/database'
import NotificationForm from './components/notification-form.vue'

const userStore = useUserStore()
const loading = ref(false)
const formVisible = ref(false)
const renderData = ref<NotificationInfo[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const handleDelete = async (record: NotificationInfo) => {
  try {
    const res = await deleteNotification(record.notification_id)
    if (res.code === 200) {
      Message.success('删除通知成功')
      fetchNotifications()
    } else {
      Message.error(res.message)
    }
  } catch (err) {
    Message.error('删除通知失败')
  }
}

const fetchNotifications = async () => {
  try {
    loading.value = true
    const res = await getNotificationList()
    if (res.code === 200) {
      renderData.value = res.data || []
      pagination.total = renderData.value.length
    }
  }
  catch (err) {
    Message.error('获取通知列表失败')
  }
  finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  formVisible.value = true
}

const onPageChange = (current: number) => {
  pagination.current = current
  fetchNotifications()
}

onMounted(() => {
  fetchNotifications()
})
</script>

<style scoped>
.page {
  padding: 0 20px 20px 20px;
}

.general-card {
  margin-top: 16px;
}
</style>