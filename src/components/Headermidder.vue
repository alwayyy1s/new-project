<template>
    <header class="header">
      <div class="header-content">
        <nav class="nav">
          <!-- 工作流 -->
          <router-link to="/workspace" class="nav-item" :class="{ active: currentRoute === '/workspace' }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
              <path fill-rule="evenodd" d="M12 6.75a5.25 5.25 0 016.775-5.025.75.75 0 01.313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 011.248.313 5.25 5.25 0 01-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 112.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0112 6.75zM4.117 19.125a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z" clip-rule="evenodd" />
            </svg>
            <span>工作流</span>
          </router-link>
          <!-- 新建 -->
          <button class="nav-item" @click="addWorkflow">  新建</button>
        </nav>
        <div class="right-section">
          <!-- 搜索 -->
          <div class="search-container">
            <input type="text" placeholder="搜索" class="search-input" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="search-icon">
              <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import {computed} from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const currentRoute = computed(() => route.path);
  
  // 新建工作流跳转
  const addWorkflow = () => {
    router.push('/workspace/addflow');
  };
 
  </script>
  
  <style scoped>
  .header {
    background-color: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    padding: 0.5rem 1rem;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
  }
  
  .nav {
    display: flex;
    gap: 2rem;
    justify-content: space-between;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #6b7280;
    font-size: 0.89rem;
    transition: color 0.3s ease;
  }
  
  .nav-item:hover {
    color: #3b82f6;
  }
  
  .nav-item.active {
    color: #3b82f6;
  }
  
  .icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
  }
  
  .right-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .search-container {
    position: relative;
  }
  
  .search-input {
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    width: 200px;
  }
  
  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
  }
  button {
    padding: 10px 20px;
    background-color:white;
    color: gray;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #f3f4f6;
  }
  </style>