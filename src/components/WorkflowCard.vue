<template>
  <div class="workflow-grid">
    <div 
      v-for="workflow in workflows" 
      :key="workflow.id" 
      class="workflow-card"
      @click="navigateToWorkflow(workflow.id)"
    >
    
      <div class="workflow-card-content">
        <div class="workflow-icon" :style="{ backgroundColor: workflow.iconBg }">
          <img :src="workflow.icon" :alt="workflow.title" class="icon" />
        </div>
        <div class="workflow-info">
          <h3 class="workflow-title">{{ workflow.title }}</h3>
          <p class="workflow-category">{{ workflow.category }}</p>
        </div>
        <div class="workflow-options">
          <button @click.stop="toggleOptions(workflow.id)" class="options-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="options-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          <div v-if="workflow.showOptions" class="options-menu" >
            <div class="option" @click.stop="editWorkflow(workflow.id)">编辑</div>
            <div class="option" @click.stop="deleteWorkflow(workflow.id)">删除</div>
          </div>
        </div>
      </div>
      <!-- <div class="workflow-tags">
        <button class="add-tag-button" @click.stop="addTag(workflow.id)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="add-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          添加标签
        </button>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const workflows = ref([
  {
    id: 1,
    title: '全书翻译',
    category: '工作流',
    icon: '/placeholder.svg?height=40&width=40',
    iconBg: '#FFF0E6',
    showOptions: false
  },
  {
    id: 2,
    title: '文本总结工作流',
    category: '工作流',
    icon: '/placeholder.svg?height=40&width=40',
    iconBg: '#E6F7FF',
    showOptions: false
  },
  {
    id: 3,
    title: '文本情感分析工作流',
    category: '工作流',
    icon: '/placeholder.svg?height=40&width=40',
    iconBg: '#F6FFED',
    showOptions: false
  },
  {
    id: 4,
    title: '文本总结工作流',
    category: '工作流',
    icon: '/placeholder.svg?height=40&width=40',
    iconBg: '#FFF0F6',
    showOptions: false
  }
]);


const navigateToWorkflow = (id) => {
  router.push(`/workspace/workflow/${id}`);
};

const toggleOptions = (id) => {
  const workflow = workflows.value.find(w => w.id === id);
  if (workflow) {
    workflow.showOptions = !workflow.showOptions;
  }
};

const editWorkflow = (id) => {
  console.log(`Editing workflow ${id}`);
  const workflow = workflows.value.find(w => w.id === id);
  workflow.showOptions=false
  // Implement edit logic here
};

const deleteWorkflow = (id) => {
  console.log(`Deleting workflow ${id}`);
  const workflow = workflows.value.find(w => w.id === id);
  workflow.showOptions=false
  // Implement delete logic here
};

// const addTag = (id) => {
//   console.log(`Adding tag to workflow ${id}`);
//   // Implement add tag logic here
// };
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

.icon {
  width: 1.5rem;
  height: 1.5rem;
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

.workflow-tags {
  padding: 0.5rem 1rem;
  border-top: 1px solid #e0e0e0;
}

.add-tag-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.add-tag-button:hover {
  color: #1890ff;
}

.add-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
}
</style>