import axios from 'axios'
import { Message } from 'element-ui';
var instanceAxios = axios.create()
const that = this;
instanceAxios.interceptors.request.use(
    res => {
        return res
    },
    err => {
        // 这里显示网络异常
        return Promise.reject(err)
    },
)

// Add a response interceptor
instanceAxios.interceptors.response.use(
    res => {
        let resData = res.data;
        if (resData.code == 200) {
            return resData
        }
        else {
            if (resData.code == 1003) {
                Message.error(resData.msg);
                setTimeout(() => {
                    location.href = "#/login";
                }, 2500);
            }
            else {
                Message.error(resData.msg)
            }
            return resData;
        }
    },
    err => {
        // 这里显示网络异常
        return {
            code: 404,
            msg: '服务端挂了',
        }
    },
)

instanceAxios.defaults.withCredentials = true
instanceAxios.defaults.timeout = 115000
export default instanceAxios
