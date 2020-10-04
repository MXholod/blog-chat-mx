<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin/list' }">
                List of posts
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                {{ $route.params.id }}
            </el-breadcrumb-item>
        </el-breadcrumb>
        Post {{ $route.params.id }}
    </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: ['admin-auth']
}
</script>
