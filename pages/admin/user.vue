<template>
  <admin-user-management />
</template>

<script>
import AdminUserManagement from '@/components/admin/AdminUserManagement'
export default {
  layout: 'admin',
  middleware: ['admin-auth'],
  components: { AdminUserManagement }
}
</script>
