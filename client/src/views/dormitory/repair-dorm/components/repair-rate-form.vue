<template>
    <a-modal
      v-model:visible="_visible"
      @cancel="handleCancel"
      @before-ok="handleSubmit"
      title="维修评价"
    >
      <a-form :model="form" ref="formRef" :rules="rules">
        <a-form-item field="rating" label="评分">
          <a-rate v-model="form.rating" />
        </a-form-item>
        <a-form-item field="comment" label="评价内容">
          <a-textarea
            v-model="form.comment"
            placeholder="请输入评价内容"
            :max-length="200"
            show-word-limit
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive, computed } from 'vue'
  import { Message } from '@arco-design/web-vue'
  import type { Form } from '@arco-design/web-vue'
import { rateRepair } from '@/api/dormitory-repair'
  
  const props = defineProps<{
    visible: boolean
    repairId?: number
  }>()
  
  const emit = defineEmits(['update:visible', 'success'])
  
  const _visible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  })
  
  const formRef = ref<InstanceType<typeof Form>>()
  const form = reactive({
    rating: 0,
    comment: ''
  })
  
  const rules = {
    rating: [
      { required: true, message: '请选择评分' }
    ],
    comment: [
      { required: true, message: '请填写评价内容' }
    ]
  }
  
  const handleCancel = () => {
    form.rating = 0
    form.comment = ''
  }
  
  const handleSubmit = async () => {
    try {
      const res = await formRef.value?.validate()
      if (res) {
        return false
      }
  
      await rateRepair({
      repairId: props.repairId || 0,
      rating: form.rating,
      comment: form.comment
    })
  
      Message.success('评价成功')
      emit('success')
      emit('update:visible', false)
      handleCancel()
      return true
    } catch (error) {
      Message.error('评价失败')
      return false
    }
  }
  </script>