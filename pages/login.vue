<template>
    <el-card shadow="always" :style="{width:'400px'}">
        <admin-login />
    </el-card>
</template>

<script>
import AdminLogin from '@/components/admin/AdminLogin'
export default {
  name: 'login',
  layout: 'admin-login',
  components: { AdminLogin }
}
</script>
