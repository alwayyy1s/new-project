<template>
  <div class="app-container">
    <!-- 侧边栏  -->
    <div :class="['sidebar', { 'collapsed': isCollapsed }]">
      <!-- 折叠按钮 -->
      <button @click="toggleSidebar" class="toggle-btn">
        <i :class="['iconfont', isCollapsed ? 'icon-zhediedaohang' : 'icon-chahao']"></i>
      </button>

      <!-- 菜单 -->
      <nav class="menu">
        <router-link 
          v-for="item in menuItems" 
          :key="item.id" 
          :to="item.route"
          custom
          v-slot="{ navigate }"
        >
        <!-- 点击菜单事件 ，如果点击的是AI History 则打开历史记录侧边栏，否则导航到对应的路由 -->
          <button 
            @click="item.id === 2 ? toggleHistorySidebar() : navigate()"
            class="menu-item"
            :class="{ 'active': $route.path === item.route }"
          >
            <i :class="['iconfont',item.icon]"></i>
            <span v-if="!isCollapsed" class="menu-text">{{ item.name }}</span>
          </button>
        </router-link>
      </nav>

      <!-- 用户头像和弹出菜单 -->
      <div class="user-section">
        <button @click="toggleUserMenu" class="user-avatar">
          <img :src="userAvatar" alt="User Avatar" />
        </button>
      <!-- 弹出菜单 -->
        <div v-if="isUserMenuOpen" class="user-menu">
        <button @click="handleMenuAction('v0dev')" class="menu-button">
          <i class="iconfont icon-v0dev"></i>
          v0.dev
        </button>
        <button @click="handleMenuAction('discord')" class="menu-button">
          <i class="iconfont icon-discord"></i>
          Discord
        </button>
        <button @click="handleMenuAction('signOut')" class="menu-button">
          <i class="iconfont icon-signout"></i>
          Sign Out
        </button>
      </div>
      </div>
    </div>

     
    <!-- 主内容区域 -->
    <div class="main-content" :class="{ 'shifted': isHistorySidebarOpen }">
      <!-- 历史记录侧边栏 -->
    <div :class="['history-sidebar', { 'visible': isHistorySidebarOpen }]">
      <div class="history-header">
        <h3>历史记录</h3>
        <button @click="toggleHistorySidebar" class="close-btn">
          <i class="iconfont icon-chahao"></i>
        </button>
      </div>
      <!-- 历史记录列表 -->
      <div class="history-list">
        <div v-for="(conversation, index) in conversations" :key="index" class="history-item">
          <div class="conversation-info" @click="selectConversation(index)">
            <div class="conversation-title">{{ conversation.title }}</div>
            <div class="conversation-date">{{ formatDate(conversation.date) }}</div>
          </div>
          <!-- 删除按钮 -->
            <i @click.stop="deleteConversation(index)" class="iconfont icon-laji_huabanfuben"></i>
          
        </div>
      </div>
    </div>

    <!--主内容区域 -->
      <div class="router-view-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {  useRouter } from 'vue-router'
import { useConversationStore } from '@/stores/counter'


const router = useRouter()
const isCollapsed = ref(false)
const isUserMenuOpen = ref(false)
const userAvatar = ref('https://www.jizhicms.cn/static/source/static/pic/20.jpeg')

const isHistorySidebarOpen = ref(false)
const conversationStore = useConversationStore()
const deleteConversation = (index) => {
  conversationStore.deleteConversation(index)
}
const conversations = computed(() => conversationStore.conversations)
const menuItems = [
  { id: 1, name: 'Chat', icon: 'icon-liaotian', route: '/chat' },
  { id: 2, name: 'AI History', icon: 'icon-jurassic_wait', route: '/search' },
  { id: 3, name: 'AI Workflow', icon: 'icon-wodegongzuoliu', route: '/workspace' },
  { id: 4, name: 'AI Video', icon: 'iconfont icon-video', route: '/workflowform' },
  { id: 5, name: 'Data Analysis', icon: 'iconfont icon-analysis', route: '/analysis' },
  { id: 6, name: 'Long Text Interpretation', icon: 'iconfont icon-text', route: '/interpretation' },
]
// 折叠侧边栏
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
// 打开弹出菜单
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}
// 打开历史记录侧边栏
const toggleHistorySidebar = () => {
  isHistorySidebarOpen.value = !isHistorySidebarOpen.value
}
// 选择历史记录
const selectConversation = (index) => {
  conversationStore.setCurrentConversationIndex(index)
  router.push('/chat')
  isHistorySidebarOpen.value = false
}
// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}
// 处理菜单事件，v0dev 跳转v0.dev ，discord 跳转discord ，signOut 跳转登录页
const handleMenuAction = (action) => {
  console.log(`Handling action: ${action}`)
  switch (action) {
   
    case 'v0dev':
      // Handle v0.dev action
      break
    case 'discord':
      // Handle Discord action
      break
    case 'signOut':
      // Handle sign out action
      router.push('/login')
      break
  }
  isUserMenuOpen.value = false
}
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  background-color: #f3f4f6;
}

/* 主侧边栏样式 */
.sidebar {
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease-in-out;
  width: 250px;
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.sidebar.collapsed {
  width: 64px;
}

.toggle-btn {
  padding: 1rem;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
}

.toggle-btn i {
  font-size: 24px;
  color: #3b82f6;
}

/* 菜单样式 */
.menu {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.menu-item {
  width: 100%;
  padding: 1rem;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f3f4f6;
}

.menu-item.active {
  background-color: #e5e7eb;
}

.menu-item i {
  font-size: 24px;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.menu-text {
  margin-left: 1rem;
  color: #4b5563;
  line-height: 24px;
}

.sidebar.collapsed .menu-item {
  justify-content: center;
}

.sidebar.collapsed .menu-item i {
  margin-right: 0;
}

/* 用户部分样式 */
.user-section {
  padding: 1rem;
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: none;
  padding: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-menu {
  position: absolute;
  bottom: 100%;
  left: 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  width: 200px;
}

.menu-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  text-align: left;
  transition: background-color 0.2s;
}

.menu-button:hover {
  background-color: #f3f4f6;
}

/* 历史记录侧边栏样式 */
.history-sidebar {
  width: 0;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: width 0.3s ease-in-out;
  z-index: 10;
}

.history-sidebar.visible {
  width: 300px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
}

.history-list {
  padding: 1rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
}

.conversation-info {
  flex-grow: 1;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 1rem;
  padding: 0.25rem;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #ef4444;
}

.history-item:hover {
  background-color: #f3f4f6;
}

.conversation-title {
  font-weight: bold;
}

.conversation-date {
  font-size: 0.8rem;
  color: #6b7280;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  display: flex;
  background-color: #f3f4f6;
  transition: margin-left 0.3s ease-in-out;
  overflow: hidden; /* 防止内容溢出 */
}


.router-view-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-left: 20px; /* 添加左边距 */
}
</style>