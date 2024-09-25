import axios from 'axios'

export default async function deal (file,user_prompt) {
    const formData = new FormData();
    formData.append('user_prompt', user_prompt);
    if (file) {
        formData.append('file', file);
    }
    const response=await axios({
        method: 'post',
        url: 'http://0.0.0.0:8020/chat',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: formData

    })

    return response.data
}