<template>
    <a-modal v-model:visible="visible" :title="null" :centered="true" :footer="null"
        style="height:unset!important;width:400px" :bodyStyle="{ padding: 0, height: '605px' }" :closable="false"
        :maskClosable="false"><iframe v-if="ready" sandbox="allow-forms allow-scripts allow-same-origin" :src="url"
            title="Pay" style="width:100%; height:100%; border:0px; overflow:hidden;"></iframe></a-modal>
</template>
<script setup lang="ts">
import CryptoJS from 'crypto-js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { BookInfo } from '@/types/type'
import axios from 'axios'
import { useAxios } from '@/stores/axios'
const url = ref('https://pay.fccak.cn/submit.php')
const ready = ref(false)
const router = useRouter()
const visible = ref(false)
const urlN = useAxios().serverUrl
visible.value = true
const props = defineProps({
    record: Object as () => BookInfo,
    fV: Number
})

const info: any = ref({
    pid: 110032144,
    type: 'alipay',
    out_trade_no: props.record?.borrowId,
    notify_url: urlN + "/state",
    return_url: urlN + "/state",
    name: "User: " + props.record?.borrower + " Book: " + props.record?.name,
    money: props.fV,
    sitename: "Library",
    sign: '',
    sign_type: 'MD5',
})
/*	签名算法与支付宝签名算法相同
(money={商品金额}&name={商品名称}& notify_url={异步通知地址}&out_trade_no={商户订单号}&pid={商户ID}&return_url={同步通知地址}&sitename={站点名称}&type={支付方式}{商户密匙})*/

const mix = async () => {
    await axios.get('https://sapi.k780.com/?app=finance.rate&scur=USD&tcur=CNY&appkey=69150&sign=1d55158897a624b0bab40e69b8365143&format=').then((res) => {
        info.value.money = (info.value.money * parseFloat(res.data.result.rate)).toFixed(2)
    })
    console.log(info.value)
    const { pid, type, out_trade_no, notify_url, return_url, name, money, sitename } = info.value
    const str = `money=${money}&name=${name}&notify_url=${notify_url}&out_trade_no=${out_trade_no}&pid=${pid}&return_url=${return_url}&sitename=${sitename}&type=${type}4k0gFby5iJN`
    info.value.sign = CryptoJS.MD5(str).toString().toLowerCase()

}
const emit = defineEmits(['success'])
const count = ref(0)

mix().then(() => {
    urlMix()
    ready.value = true
})
window.addEventListener("message", function (event) {
    // 处理来自内部页面的消息
    if (event.data.success != undefined && event.data.success) {
        visible.value = false
        axios.post(useAxios().urlAlter + '/UserOp/PayFine', {
            opUser: props.record?.borrower,
            borrowId: props.record?.borrowId
        }).then((res) => {
            console.log(res)
            emit('success', event.data.success)
        })
    }
    else if (event.data.success != undefined && !event.data.success) {
        visible.value = false
        emit('success', event.data.success)
    }
    else {
        // 处理来自外部页面的消息
        console.log(event.data)
    }
});
//按顺序拼接url
const urlMix = () => {
    const { pid, type, out_trade_no, notify_url, return_url, name, money, sitename, sign, sign_type } = info.value
    url.value = `https://pay.fccak.cn/submit.php?pid=${pid}&type=${type}&out_trade_no=${out_trade_no}&notify_url=${notify_url}&return_url=${return_url}&name=${name}&money=${money}&sitename=${sitename}&sign=${sign}&sign_type=${sign_type}`
}
</script>
<style></style>