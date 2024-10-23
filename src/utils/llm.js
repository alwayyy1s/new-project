
import axios from 'axios'
// 发送提示词，返回响应
async function sendPrompt(promptText){
    const response =await axios({
        url:'http://127.0.0.1:8080/llm',
        method:'post',
        data:{prompt:promptText}
    
    })
    return response.data.response

}

export default sendPrompt