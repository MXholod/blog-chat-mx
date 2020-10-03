<template>
    <admin-user-create />
</template>

<script>
import AdminUserCreate from '@/components/admin/AdminUserCreate'
export default {
  layout: 'admin',
  middleware: ['admin-auth'],
  components: { AdminUserCreate }
}
</script>
