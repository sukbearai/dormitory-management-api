<template>
  <a-modal
    v-model:visible="_visible"
    title="宿舍详情"
    @cancel="handleClose"
  >
    <a-table
        :loading="loading"
        :data="students"
        :pagination="false"
        :bordered="false"
      >
        <template #columns>
          <a-table-column title="学号" data-index="student_number" />
          <a-table-column title="姓名" data-index="name" />
          <a-table-column title="性别" data-index="gender">
            <template #cell="{ record }">
              {{ record.gender === 1 ? '男' : '女' }}
            </template>
          </a-table-column>
          <a-table-column title="联系电话" data-index="phone" />
        </template>
      </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useRequest } from 'vue-hooks-plus'
import { getDormitoryDetail } from '@/api/dormitory'
import type { StudentRow } from '~~/types/database'

const props = defineProps<{
  visible: boolean
  dormId?: number
}>()

const emit = defineEmits(['update:visible'])

const _visible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
})

const students = ref<StudentRow[]>([])

const { loading, run: fetchDormDetail } = useRequest(
  (id: number) => getDormitoryDetail(id),
  {
    manual: true,
    onSuccess(res) {
      if (res.code === 200) {
        students.value = res.data || []
      } else {
        Message.error(res.message)
      }
    }
  }
)

const handleClose = () => {
  emit('update:visible', false)
}

watch(
  () => props.dormId,
  (id) => {
    if (id && _visible.value) {
      fetchDormDetail(id)
    }
  },
  { immediate: true }
)
</script>
