<template>
    <div class="app-container" :class="{ 'sidebar-collapsed': !sidebarVisible }">
      <div class="sidebar">
        <div class="sidebar-header">
          <h2 v-if="sidebarVisible">对话列表</h2>
          <button @click="toggleSidebar" class="toggle-sidebar-btn">
            <span v-if="sidebarVisible">&#x25C0;</span>
            <span v-else>&#x25B6;</span>
          </button>
        </div>
        <button v-if="sidebarVisible" @click="createNewConversation" class="new-chat-btn">
          <span class="icon">+</span> 新建对话
        </button>
        <div v-if="sidebarVisible" class="conversation-list">
          <div 
            v-for="(conv, index) in conversations" 
            :key="index" 
            class="conversation-item"
            :class="{ 'active': currentConversationIndex === index }"
          >
            <span @click="selectConversation(index)" class="conversation-title">{{ conv.title }}</span>
            <button @click="deleteConversation(index)" class="delete-btn" title="删除对话">×</button>
          </div>
        </div>
      </div>
  
      <div class="chat-container">
        <div class="chat-box">
          <div class="chat-header">
            <h1>AI 助手</h1>
          </div>
          <div class="chat-messages" ref="chatMessages">
            <div v-for="(message, index) in currentConversation.messages" :key="index" class="message-wrapper">
              <div :class="['message', message.sender === 'user' ? 'user-message' : 'ai-message']">
                <div class="message-content">
                  <div v-if="message.text">{{ message.text }}</div>
                  </div>
              </div>
              <div v-if="message.file" :class="['file-message', message.sender==='user'?'user-file':'ai-file']" @click="viewFile(message.file)">
                <div class="file-icon">
                    <!-- 用户文件图标 -->
                    <svg v-if="message.sender === 'user'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                      <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" />
                    </svg>
                    <!-- AI 文件图标 -->
                    <svg v-else t="1727160191758" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1494" width="200" height="200"><path d="M512 81.92l372.736 215.04v430.08L512 942.08 139.264 727.04v-430.08L512 81.92m0-81.92c-14.336 0-28.672 4.096-40.96 10.24L98.304 225.28c-24.576 14.336-40.96 40.96-40.96 71.68v430.08c0 28.672 16.384 55.296 40.96 71.68L471.04 1013.76c12.288 8.192 26.624 10.24 40.96 10.24s28.672-4.096 40.96-10.24L925.696 798.72c24.576-14.336 40.96-40.96 40.96-71.68v-430.08c0-28.672-16.384-55.296-40.96-71.68L552.96 10.24c-12.288-6.144-26.624-10.24-40.96-10.24z" p-id="1495"></path><path d="M698.368 352.256L532.48 450.56c-12.288 8.192-28.672 8.192-43.008 0l-153.6-96.256c-18.432-12.288-45.056-6.144-57.344 12.288-12.288 18.432-6.144 45.056 12.288 57.344l157.696 98.304c12.288 8.192 18.432 20.48 18.432 34.816V757.76c0 22.528 18.432 40.96 40.96 40.96s40.96-18.432 40.96-40.96v-200.704c0-14.336 8.192-28.672 20.48-34.816l167.936-100.352c20.48-12.288 26.624-36.864 14.336-55.296-8.192-20.48-32.768-26.624-53.248-14.336z" p-id="1496">
                    </path></svg>
                  </div>
                    <div class="file-info">
                      <span class="file-name">{{ message.file.name }}</span>
                      <span class="file-size">{{ formatFileSize(message.file.size) }}</span>
                    </div>  
                </div>
            </div>
          </div>
          
          <div class="input-area">
            <form @submit.prevent="sendMessage" class="message-form">
              <textarea 
                v-model="userInput"
                @input="adjustTextareaHeight"
                @keydown.enter.exact.prevent="sendMessage"
                placeholder="输入消息..."
                class="input-field"
                rows="1"
                ref="inputField"
              ></textarea>
              <button type="submit" class="send-button" :disabled="!userInput.trim() ">
                <span class="icon">&#x27A4;</span>
              </button>
            </form>
            
            <div class="file-upload">
              <input 
                type="file" 
                ref="fileInput" 
                @change="onFileSelected" 
                class="file-input"
              />
              <button  class="upload-button" @click="fileUpload">
                <span class="icon">&#x1F4C1;</span> 上传文件
              </button>
            </div>
            
            <div v-if="selectedFile" class="selected-file">
              已选择文件: {{ selectedFile.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick, computed } from 'vue'
  import deal from '@/utils/deal'
  const conversations = ref([
    {
      title: '初始对话',
      messages: [{ sender: 'ai', text: '你好！我能为你做些什么？' ,}]
    }
  ])
  

  const currentConversationIndex = ref(0)
  const userInput = ref('')
  const selectedFile = ref(null)
  const chatMessages = ref(null)
  const inputField = ref(null)
  const sidebarVisible = ref(true)
  const aiResponse = ref(null) 
  const fileInput = ref(null);
  const currentConversation = computed(() => conversations.value[currentConversationIndex.value])
  
  const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  const userMessage = userInput.value.trim();
  const newMessage = {
    sender: 'user',
    text: userMessage,
    file: selectedFile.value
  };

  currentConversation.value.messages.push(newMessage);
  userInput.value = '';
  await nextTick();
  scrollToBottom();

  try {
    aiResponse.value= await deal(selectedFile.value, userMessage);
    console.log(aiResponse)
    if (aiResponse.value.file) {
       const aiMessage = {
        sender: 'ai',
        text: aiResponse.value.response,
        file: aiResponse.value.file
    };
    currentConversation.value.messages.push(aiMessage);
    }
    else{
      const aiMessage= {
        sender: 'ai',
        text: aiResponse.value.response,
      }
      currentConversation.value.messages.push(aiMessage);
    }
    
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('获取AI响应时出错:', error);
    // 可以在这里添加错误处理逻辑，比如显示错误消息给用户
  }

  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = ''
  }
};

const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};
  
  const onFileSelected = (event) => {
    selectedFile.value = event.target.files[0]
  }
  
  const adjustTextareaHeight = () => {
    const textarea = inputField.value
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }
  
  const createNewConversation = () => {
    conversations.value.push({
      title: `对话 ${conversations.value.length + 1}`,
      messages: [{ sender: 'ai', text: '这是一个新的对话。我能为你做些什么？' }]
    })
    currentConversationIndex.value = conversations.value.length - 1
  }
  
  const selectConversation = (index) => {
    currentConversationIndex.value = index
  }
  
  const deleteConversation = (index) => {
    if (conversations.value.length > 1) {
      conversations.value.splice(index, 1)
      if (currentConversationIndex.value >= conversations.value.length) {
        currentConversationIndex.value = conversations.value.length - 1
      }
    }
  }
  
  const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value
  }
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB'
    else return (bytes / 1073741824).toFixed(1) + ' GB'
  }
  const fileUpload = () => {
    if (fileInput.value)
    fileInput.value.click()
  }
  const viewFile = (file) => {
    if (file.path) {
    const url=file.path
    window.open(url, '_blank')
  }}
 
  onMounted(() => {
    adjustTextareaHeight()
  })
  </script>
  
  <style scoped>
  .app-container {
    display: flex;
    height: 100vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    background-color: #f5f5f5;
    transition: all 0.3s ease;
  }
  
  .sidebar {
    width: 280px;
    background-color: #f3f4f6;
    color: #1b1b1c;
    padding: 20px;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  
  .sidebar h2 {
    margin: 0 auto;
  }
  
  .sidebar-collapsed .sidebar {
    width: 60px;
    padding: 20px 10px;
  }
  
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .toggle-sidebar-btn {
    background: none;
    border: none;
    color: #1b1b1c;
    font-size: 20px;
    cursor: pointer;
    padding: 5px;
    transition: transform 0.3s ease;
  }
  
  .sidebar-collapsed .toggle-sidebar-btn {
    transform: rotate(180deg);
  }
  
  .new-chat-btn {
    width: 100%;
    padding: 10px;
    background-color: #3498db;
    color: #1b1b1c;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .new-chat-btn:hover {
    background-color: #2980b9;
  }
  
  .conversation-list {
    overflow-y: auto;
    flex-grow: 1;
  }
  
  .conversation-item {
    padding: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    margin-bottom: 5px;
    transition: background-color 0.3s;
  }
  
  .conversation-item:hover {
    background-color: #878d9a;
  }
  
  .conversation-item.active {
    background-color: #766bed;
  }
  
  .conversation-title {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: #ecf0f1;
    opacity: 0.7;
    transition: opacity 0.3s;
  }
  
  .delete-btn:hover {
    opacity: 1;
  }
  
  .chat-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
  }
  
  .sidebar-collapsed .chat-container {
    margin-left: 60px;
  }
  
  .chat-box {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin: 20px;
    overflow: hidden;
  }
  
  .chat-header {
    background-color: #f3f4f6;
    color: black;
    padding: 15px 20px;
    text-align: center;
  }
  
  .chat-header h1 {
    margin: 0;
    font-size: 24px;
  }
  
  .chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  
  .message-wrapper {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }
  
  .message {
    max-width: 70%;
    padding: 10px 15px;
    border-radius: 20px;
    line-height: 1.4;
  }
  
  .user-message {
    background-color: #3498db;
    color: white;
    margin-left: auto;
    margin-bottom: 5px;
    border-bottom-right-radius: 0;
  }
  
  .ai-message {
    background-color: #ecf0f1;
    color: #333;
    margin-right: auto;
    margin-bottom: 5px;
    border-bottom-left-radius: 0;
  }
  
  .message-content {
    word-wrap: break-word;
    white-space: pre-wrap;
  }
  
  .user-file {
    width: 130px;
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 10px;
    margin-left: auto;
  }
  .file-message:hover {
      cursor: pointer;
  }
  .ai-file {
    width: 130px;
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 10px;
    margin-right: auto;
  }

 .file-icon {
    font-size: 24px;
    margin-right: 10px;
  }
  
  .file-info {
    flex-grow: 1;
  }
  
  .file-name {
    font-weight: bold;
    display: block;
  }
  
  .file-size {
    font-size: 12px;
    color: #666;
  }
  
  .view-file-btn {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .view-file-btn:hover {
    background-color: #2980b9;
  }
  
  .input-area {
    padding: 20px;
    border-top: 1px solid #e0e0e0;
  }
  
  .message-form {
    display: flex;
    margin-bottom: 10px;
  }
  
  .input-field {
    flex-grow: 1;
    padding: 10px 15px;
    border: 1px solid #bdc3c7;
    border-radius: 20px;
    resize: none;
    font-size: 16px;
    transition: border-color 0.3s;
    min-height: 40px;
    max-height: 120px;
    overflow-y: auto;
  }
  
  .input-field:focus {
    outline: none;
    border-color: #3498db;
  }
  
  .send-button {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-left: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .send-button:hover:not(:disabled) {
    background-color: #2980b9;
  }
  
  .send-button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
  
  .file-upload {
    margin-top: 10px;
  }
  
  .file-input {
    display: none;
  }
  .file-icon svg {
  width: 24px;
  height: 24px;
  color: rgb(53, 57, 171);
}
  
  .upload-button {
    padding: 8px 15px;
    background-color: gray;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
  }
  
  .upload-button:hover {
    background-color: #27ae60;
  }
  
  .selected-file {
    margin-top: 10px;
    font-size: 14px;
    color: #7f8c8d;
  }
  
  .icon {
    margin-right: 5px;
  }
  
  @media (max-width: 768px) {
    .app-container {
      flex-direction: column;
    }
  
    .sidebar {
      width: 100%;
      max-height: 50vh;
    }
  
    .sidebar-collapsed .sidebar {
      width: 100%;
      max-height: 60px;
    }
  
    .sidebar-collapsed .chat-container {
      margin-left: 0;
    }
  
    .chat-box {
      margin: 10px;
    }
  
    .message {
      max-width: 85%;
    }
  }
  </style>