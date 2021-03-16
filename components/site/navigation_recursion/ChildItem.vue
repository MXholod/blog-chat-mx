<template>
  <el-submenu v-if="child && child.childrenItems.length" :index="'/sport_life/'+child.id">
    <template slot="title">{{ child.pageName }}</template>
    <el-menu-item  :index="'/sport_life/'+child.id">
      {{ child.pageName +'( Full list)'}}
    </el-menu-item>
    <node
      v-for="curChild in child.childrenItems"
      :key="curChild.id"
      :child="curChild"
      :index="'/sport_life/'+curChild.id">
      {{ curChild.pageName+' Test' }}
    </node>
  </el-submenu>
  <el-menu-item v-else :index="'/sport_life/'+child.id">
    {{ child.pageName }}
  </el-menu-item>
</template>

<script>
export default {
  name: "node",
  props:{ child: Object },
}
</script>

<style lang="scss" scoped>

</style>
