<script setup lang="ts">
//获得get参数并向iframe外部传递

import { useRouter } from 'vue-router'
import {ref} from 'vue'
const router=useRouter()

const get=()=>{
    const {query}=router.currentRoute.value
    if(Object.keys(query).length==0){
        return {success:false}
    }
    else 
    return {success:true,...query}
}
//通过iframe方式向外部传递
//不是emit,这个网页是在iframe内部使用
window.parent.postMessage(get(),'*')

</script>