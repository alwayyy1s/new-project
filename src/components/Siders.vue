<template>
  <div class="workflow-page" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title" v-if="!isSidebarCollapsed">发现</h2>
        <button @click="toggleSidebar" class="sidebar-toggle" :title="isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="toggle-icon">
            <path v-if="isSidebarCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div class="sidebar-content">
        <div class="workspace-section">
          <h3 class="workspace-title" v-if="!isSidebarCollapsed">工作区</h3>
          <ul class="workspace-list">
            <li v-for="item in workspaceItems" :key="item.id" class="workspace-item">
              <img :src="item.icon" :alt="item.name" class="workspace-icon" />
              <span class="workspace-name" v-if="!isSidebarCollapsed">{{ item.name }}</span>
            </li>
          </ul>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <div class="workflow-section">
        <div class="workflow-header">
          <div class="workflow-title-container">
            <img src="" alt="Workflow Icon" class="workflow-icon" />
            <h1 class="workflow-title">文本总结工作流</h1>
          </div>
          <div class="workflow-actions">
            <button class="action-button">运行一次</button>
            <button class="action-button primary">批量运行</button>
          </div>
        </div>

        <div class="input-section">
          <h2 class="input-title">需要总结的文本</h2>
          <textarea
            v-model="inputText"
            class="input-textarea"
            placeholder="需要总结的文本"
            rows="6"
          ></textarea>
        </div>

        <div class="options-section">
          <h2 class="options-title">技术摘要 或 概述</h2>
          <select v-model="selectedOption" class="options-select">
            <option value="">请选择选项</option>
            <option value="technical">技术摘要</option>
            <option value="overview">概述</option>
          </select>
        </div>

        <div class="action-buttons">
          <button class="secondary-button">清空</button>
          <button class="primary-button">
            <span class="button-icon">▶</span>
            运行
          </button>
        </div>
      </div>
    </main>

    <aside class="ai-assistant">
      <div class="ai-assistant-header">
        <img src="" alt="AI Icon" class="ai-icon" />
        <h2 class="ai-title">运行结果</h2>
      </div>
      <div class="ai-content">
        <img src="" alt="AI Assistant" class="ai-image" />
        <p class="ai-message">呈现你的内容。</p>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const workspaceItems = ref([
  { id: 1, name: '文本总结工作流', icon: '/placeholder.svg?height=24&width=24' },
  { id: 2, name: 'SVG Logo 设计', icon: '/placeholder.svg?height=24&width=24' },
  { id: 3, name: '文本总结工作流', icon: '/placeholder.svg?height=24&width=24' },

]);

const inputText = ref('');
const selectedOption = ref('');
const isSidebarCollapsed = ref(false);

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<style scoped>
.workflow-page {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
  transition: all 0.3s ease;
}

.sidebar {
  width: 250px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-collapsed .sidebar {
  width: 60px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.sidebar-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

.sidebar-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.toggle-icon {
  width: 24px;
  height: 24px;
  color: #666;
}

.sidebar-content {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}

.workspace-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.workspace-list {
  list-style-type: none;
  padding: 0;
}

.workspace-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
}

.workspace-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.sidebar-collapsed .workspace-name {
  display: none;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.workflow-title-container {
  display: flex;
  align-items: center;
}

.workflow-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.workflow-title {
  font-size: 24px;
  font-weight: bold;
}

.workflow-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background-color: #ffffff;
  border-radius: 4px;
  cursor: pointer;
}

.action-button.primary {
  background-color: #1890ff;
  color: #ffffff;
  border-color: #1890ff;
}

.input-section, .options-section {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
}

.input-title, .options-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.input-textarea {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 10px;
  resize: vertical;
}

.options-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.secondary-button, .primary-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.secondary-button {
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
}

.primary-button {
  background-color: #1890ff;
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
}

.button-icon {
  margin-right: 5px;
}

.ai-assistant {
  width: 600px;
  background-color: #ffffff;
  padding: 20px;
  border-left: 1px solid #e0e0e0;
}

.ai-assistant-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.ai-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.ai-title {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.ai-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.ai-image {
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
}

.ai-message {
  color: #666;
}
</style>