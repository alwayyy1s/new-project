<template>
  <div class="result-window" v-show="modelValue">
    <span class="iconfont icon-zhedie5" @click="closeResultWindow"></span>
  <!-- 结果内容区域 -->
    <div class="result-content">
      <!-- 如果当前路径是resultflow 则显示工作流结果，否则显示文件内容 -->
      <ResultFlow v-if="isResultFlow" :key="componentKey" />
      <!-- 如果结果是url 则显示iframe ，否则显示文本内容 -->
      <iframe v-if="isUrl" :src="resultUrl" frameborder="0"></iframe>
      <div v-else-if="resultContent" class="text-content">{{ resultContent }}</div>
      <div v-else class="text-content">无内容可显示</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch,shallowRef,onUnmounted } from 'vue'
import axios from 'axios'
import {useWorkflowStore} from '@/stores/counter'
import ResultFlow from '@/components/result_flow/result_flow.vue'

const props = defineProps({
  modelValue: Boolean,
  resultUrl: String

})
const currentView = shallowRef(null)
const componentKey = ref(0)
const workflowStore = useWorkflowStore()
const graphData = ref(null);
const resultContent = ref('')
// 监听 store 中的图数据变化
watch(() => workflowStore.graphData['currentGraph'], (newGraphData) => {
  console.log('Graph data in store updated:', newGraphData);
  graphData.value = newGraphData;
  
});
// 定义关闭结果窗口事件，触发父组件的close事件
const emit = defineEmits(['close'])
// 关闭结果窗口，触发关闭事件
const closeResultWindow = () => {
  emit('close')
}
// 判断结果是否是url
const isUrl = computed(() => {
  return props.resultUrl && (props.resultUrl.startsWith('http://') || props.resultUrl.startsWith('https://'))
})
// 判断结果是否是工作流，如果当前路径是resultflow 则显示工作流结果，否则显示文件内容
const isResultFlow = computed(() => props.resultUrl === 'http://localhost:5173/resultflow')

// 监听结果url 变化，如果url 为空，则清空文本内容，否则获取文件内容
watch(() => props.resultUrl, async (newUrl) => {
  if (!newUrl) {
    resultContent.value = ''
    return
  }

  if (!isUrl.value) {
    try {
      const response = await axios.get(`http://0.0.0.0:8020${newUrl}`)
      console.log(response.data)
      resultContent.value = response.data
    } catch (error) {
      console.error('获取文件内容失败:', error)
      resultContent.value = '无法加载文件内容'
    }
  } else {
    resultContent.value = '' // 清空文本内容，因为将使用 iframe 显示
  }
}, { immediate: true })
// 确保在组件卸载时清理路由
onUnmounted(() => {
  currentView.value = null
})
</script>

<style scoped>
result-window {
  height: 100%;
  overflow-y: auto;
  border-left: 2px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.result-content {
  flex: 1;
  height: 100vh;
  overflow: auto;
  padding: 15px;
}

.result-content iframe {
  width: 100%;
  height: 100%;
  border: none;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.text-content {
  padding: 20px;
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.iconfont{
  font-size: 24px;
  color: #333;
  margin-left: 10px;
}
</style>