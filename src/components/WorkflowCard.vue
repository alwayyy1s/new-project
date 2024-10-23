<template>
  <div class="workflow-grid">
    <div 
      v-for="workflow in workflows" 
      :key="workflow.id" 
      class="workflow-card"
      @click="navigateToWorkflow(workflow.title)"
    >
      <div class="workflow-card-content">
        <div class="workflow-icon" >
          <i class="iconfont icon-user_pin"></i>
        </div>
        <div class="workflow-info">
          <h3 class="workflow-title">{{ workflow.title }}</h3>
        </div>
       
        <div class="workflow-options">
          <button @click.stop="toggleOptions(workflow.id)" class="options-button">
            <i class="iconfont icon-gengduo"></i>
          </button>
          <div v-if="workflow.showOption" class="options-menu" >
            <!-- <div class="option" @click.stop="editWorkflow(workflow.id)">编辑</div> -->
            <div class="option" @click.stop="deleteWorkflow(workflow.id)">删除</div>
          </div>
        </div>
        
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { ref ,onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import {getWorkCardData,deleteGraphData} from '@/utils/Graph.js'
const router = useRouter();
// const workflows = ref([
//   {
//     id: 1,
//     title: '全书翻译',
//     showOptions: false
    
//     // showOptions: false
//   },
//   {
//     id: 2,
//     title: '文本总结工作流',
//     showOptions: false
//   },
//   {
//     id: 3,
//     title: '文本情感分析工作流',
//     showOptions: false
//   },
//   {
//     id: 4,
//     title: '文本总结工作流',
//     showOptions: false
//   }
// ]);

const workflows=ref([])

const updateWorkflows = async () => {
  // 发送获取工作流请求
  const response=await getWorkCardData()
  console.log(response)
  workflows.value=response
  console.log(workflows.value)
}

// 初始调用一次
updateWorkflows();

// 使用 onMounted 钩子函数来初始化数据
onMounted(() => {
  updateWorkflows();
});
// 导航到工作流
const navigateToWorkflow = (title) => {
  router.push(`/workspace/workflow/${title}`);
};
// 切换工作流选项
const toggleOptions = (id) => {
  const workflow = workflows.value.find(w => w.id === id);
  if (workflow) {
   workflow.showOption = !workflow.showOption
  }
};


// 删除工作流
const deleteWorkflow = async (id) => {
  const workflow = workflows.value.find(w => w.id === id);
  try {
    await ElMessageBox.confirm(
      `确定要删除标题为 "${workflow.title}" 的工作流吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    // 发送删除图数据请求
    await deleteGraphData(workflow.title)
    // 更新工作流数据
    updateWorkflows()

    // 显示成功消息
    ElMessage({
      type: 'success',
      message: '工作流删除成功',
    });
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除工作流时出错:', error);
      ElMessage({
        type: 'error',
        message: '删除工作流失败',
      });
    }
  }
};
</script>

<style scoped>

.workflow-grid {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-template-rows: 160px;
  gap: 1rem;
  padding: 1rem;
}

.workflow-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 160px; /* 设置最小高度 */
}

.workflow-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.workflow-card-content {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.workflow-icon {
  width: 3rem;
  height: 3rem;
  background-color: #FFF0E6;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  transition: all 0.3s ease;
}

.workflow-card:hover .workflow-icon {
  transform: scale(1.1);
}

.iconfont {
  font-size: 1.5rem;
  color: #333;
}

.workflow-info {
  flex-grow: 1;
}

.workflow-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  transition: color 0.3s ease;
}

.workflow-card:hover .workflow-title {
  color: #1890ff;
}

.workflow-category {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.workflow-options {
  position: relative;
  align-self: flex-end;
}

.options-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.options-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
}

.options-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #666;
}

.options-menu {
  position: absolute;
  right: -15px;
  top: 130%;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.option {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 90px;
}

.option:hover {
  background-color: #f0f0f0;
}
</style>