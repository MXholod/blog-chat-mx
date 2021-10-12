<template>
  <div>
    <el-button v-if="!allStatisticsLocal" @click="getChartDataAgain" size="mini">
      Try downloading the chart data again
    </el-button>
    <el-collapse
      v-else-if="'comments' && 'views' && 'roomsAndMessages' && 'systemMessagesAnalytics' in allStatisticsLocal"
      v-model="activeName" accordion>
      <el-collapse-item
        v-for="(statistics, propertyName, index) in allStatisticsLocal"
        :key="index"
        :title="statistics.label"
        :name="index+1"
      >
        <single-chart
          :label="statistics.label"
          :labels="statistics.labels"
          :data="statistics.data"
        />
      </el-collapse-item>
    </el-collapse>
    <el-alert
      v-else
      title="Data to draw charts is absent"
      type="warning"
      :closable="false">
    </el-alert>
  </div>
</template>

<script>
import SingleChart from './SingleChart.vue';
export default {
  props:{
    allStatistics: {
      required: true,
      validator: prop => typeof prop === 'object' || prop === null
    }
  },
  components: { SingleChart },
  data(){
    return {
      allStatisticsLocal: this.allStatistics,
      activeName: 1
    }
  },
  methods:{
    async getChartDataAgain(){
      try{
        const result = await this.$axios.$get('/api/chart_statistics/all_statistics');
        if(result?.message){
          this.allStatisticsLocal = result.allStatistics;
        }
      }catch(e){
        this.allStatisticsLocal = {};
        console.log(e);
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
