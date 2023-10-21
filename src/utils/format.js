import { dayjs } from 'element-plus'

// 封装好了之后只要在我们页面中导入调用就好
export const formatTime = (time) => dayjs(time).format('YYYY年MM月DD日')
