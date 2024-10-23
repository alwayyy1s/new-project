<template>
  <div class="node-menu" :style="menuStyle">
    <div class="menu-content">
      <div v-for="(group, groupIndex) in menuItems" :key="groupIndex" class="menu-group">
        <div class="group-title">{{ group.group }}</div>
        <button 
          v-for="(item, index) in group.items" 
          :key="index" 
          @click="$emit('add-child', item.action)"
        >
          <span class="icon" :class="item.iconClass"></span>
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import LLM from '@/views/LLM.vue';
import { computed } from 'vue';

const props = defineProps({
  position: {
    type: Object,
    required: true,
  },
});

const menuStyle = computed(() => ({
  left: `${props.position.x + 1}px`,
  top: `${props.position.y + 2}px`,
}));

const menuItems = [
  {
    group: '基础节点',
    items: [
      { label: '开始', action: 'startNode', iconClass: 'i-data' },
      { label: '结果输出', action: 'endNode', iconClass: 'i-loop' },
    ]
  },
  {
    group: '输入',
    items: [
      { label: '文件上传', action: 'node1', iconClass: 'i-navigate' },
      { label: '用户输入', action: 'node1', iconClass: 'i-error' },
      
    ]
  },
  {
    group: '处理节点',
    items: [
      { label: '模型调用', action: 'node2', iconClass: 'i-transform' },
      { label: '工具调用', action: 'node3', iconClass: 'i-condition' },
      { label: '文件处理', action: 'store', iconClass: 'i-store' },
    ]
  },
  {
    group: '其他',
    items: [
      { label: '提示词', action: 'notify', iconClass: 'i-notify' },
    ]
  }
];

defineEmits(['add-child']);
</script>

<style scoped>
.node-menu {
  position: absolute;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  width: 140px;
  max-height: 300px;
  overflow: hidden;
}

.menu-content {
  max-height: 300px;
  overflow-y: auto;
  padding: 4px;
}

.menu-content::-webkit-scrollbar {
  width: 6px;
}

.menu-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.menu-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.menu-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
.menu-group {
  margin-bottom: 8px;
}

.group-title {
  font-size: 12px;
  color: #888;
  padding: 4px 10px;
  font-weight: bold;
}
button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  background-color: transparent;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #f0f0f0;
}

.icon {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  display: inline-block;
}

.i-data::before { content: '📊'; }
.i-navigate::before { content: '🔀'; }
.i-transform::before { content: '🔄'; }
.i-condition::before { content: '🔀'; }
.i-loop::before { content: '🔁'; }
.i-error::before { content: '⚠️'; }
.i-store::before { content: '💾'; }
.i-notify::before { content: '📢'; }
.i-schedule::before { content: '⏰'; }
.i-api::before { content: '🌐'; }
</style>