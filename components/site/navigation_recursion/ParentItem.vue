<template>
  <div v-if="parentData">
    <div v-for="parentDataItem in parentData" :key="parentDataItem.id">
      <child-item v-if="parentDataItem.childrenItems.length !== 0" :child="parentDataItem"></child-item>
      <el-menu-item v-else :index="'/sport_life/'+parentDataItem.id">
        {{ parentDataItem.pageName }}
      </el-menu-item>
    </div>
  </div>
</template>

<script>
import ChildItem from '@/components/site/navigation_recursion/ChildItem';
export default {
  props:{ parentData: Array },
  components:{
    ChildItem
  }
}
</script>

<style lang="scss" scoped>

</style>
