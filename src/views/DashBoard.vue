<template>
    <div style="width；100%;padding-left:20px;padding-right:20px;">
        <div style="padding-top:20px;font-size: 45px;text-align: center;">Welcome {{ client.clientData.clientName }}</div>
        <div style="text-align: center;font-size: 20px;color:gray">Check Your Work in This Dashboard</div>
        <component :is="selection"></component>
    </div>
</template>
<script setup lang="ts">
import { useClient } from '@/stores/client';
import { defineAsyncComponent,computed } from 'vue';
const client = useClient();
const UserDash =defineAsyncComponent( () => import('@/components/Dashboards/UserDash.vue'));
const AdminDash = defineAsyncComponent( () => import('@/components/Dashboards/AdminDash.vue'));
const StaffDash = defineAsyncComponent( () => import('@/components/Dashboards/StaffDash.vue'));
const SuperDash= defineAsyncComponent( () => import('@/components/Dashboards/SuperDash.vue'));
const selection=computed(()=>{
    if(client.isSuper){
        return SuperDash
    }else if(client.isAdmin){
        return AdminDash
    }else if(client.isStaff){
        return StaffDash
    }else{
        return UserDash
    }
})

</script>