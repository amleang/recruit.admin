<template>
  <div :style="`height:${tableHeight}px`">
     
    <el-card>
      <div slot="header">
        <span>数据汇总</span>
      </div>
      <div class="num-total">
        <el-row>
          <el-col :span="8">
            <div class="title">会员数</div>
            <div class="num">已注册:<span>{{form.usercount}}</span>;未注册：<span>{{form.userregcount}}</span></div>
          </el-col>
          <el-col :span="8">
            <div class="title">招工信息</div>
            <div class="num">开启:<span>{{form.recruitocount}}</span>;关闭:<span>{{form.recruitccount}}</span></div>
          </el-col>
          <el-col :span="8">
            <div class="title">报名数</div>
            <div class="num"><span>{{form.enrollcount}}</span></div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card style="margin-top:30px;">
      <div slot="header">
        <span>最近一周会员</span>
      </div>
      <div id="userChart" :style="{width: '100%', height: '300px'}"></div>
    </el-card>
    <el-card style="margin-top:30px;">
      <div slot="header">
        <span>最近一周发布招工</span>
      </div>
      <div id="recruitChart" :style="{width: '100%', height: '300px'}"></div>
    </el-card>
    <el-card style="margin-top:30px;">
      <div slot="header">
        <span>最近一周报名</span>
      </div>
      <div id="enrollChart" :style="{width: '100%', height: '300px'}"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeight: 500,
      form: {}
    };
  },
  mounted() {
    this.tableHeight = document.documentElement.clientHeight - 210 + 55;
    this.http.get("/api/home/report").then(res => {
      if (res.code == 200) {
        this.form = res.data;
        this.userChart_handle(res.data);
        this.recruitChart_handle(res.data);
        this.enrollChart_handle(res.data);
      } else {
        this.$message.error(res.msg);
      }
    });
  },
  methods: {
    userChart_handle(data) {
      var title = [];
      var value1 = [];
      var value2 = [];
      data.userlist.forEach(item => {
        title.push(item.createAt);
      });
      data.userreglist.forEach(item => {
        if (title.indexOf(item.createAt) == -1) title.push(item.createAt);
      });
      title.sort(function(a, b) {
        return Date.parse(a) - Date.parse(b); //时间正序
      });
      title.forEach(item => {
        var v1 = data.userlist.filter(sitem => sitem.createAt == item);
        var v2 = data.userreglist.filter(sitem => sitem.createAt == item);
        if (v1.length == 0) value1.push(0);
        else value1.push(v1[0].count);
        if (v2.length == 0) value2.push(0);
        else value2.push(v2[0].count);
      });
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("userChart"));
      // 绘制图表
      myChart.setOption({
        color: ["#3398DB", "#f00"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["获取信息", "注册"]
        },
        xAxis: {
          data: title
        },
        yAxis: {},
        series: [
          {
            name: "获取信息",
            type: "bar",
            data: value1
          },
          {
            name: "注册",
            type: "bar",
            data: value2
          }
        ]
      });
    },
    recruitChart_handle(data) {
      var recuritlist = data.recuritlist;
      var title = [];
      var value = [];
      recuritlist.forEach(item => {
        title.push(item.createAt);
        value.push(item.count);
      });
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("recruitChart"));
      // 绘制图表
      myChart.setOption({
        color: ["#3398DB"],
        tooltip: {},
        xAxis: {
          data: title
        },
        yAxis: {},
        series: [
          {
            name: "数量",
            type: "bar",
            data: value
          }
        ]
      });
    },
    enrollChart_handle(data) {
      var enrolllist = data.enrolllist;
      var title = [];
      var value = [];
      enrolllist.forEach(item => {
        title.push(item.createAt);
        value.push(item.count);
      });
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("enrollChart"));
      // 绘制图表
      myChart.setOption({
        color: ["#3398DB"],
        tooltip: {},
        xAxis: {
          data: title
        },
        yAxis: {},
        series: [
          {
            name: "人数",
            type: "bar",
            data: value
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.num-total {
  font-size: 22px;
}
.num-total .title {
  text-align: center;
  height: 60px;
  line-height: 60px;
}
.num-total .num {
  text-align: center;

  height: 60px;
  line-height: 60px;
}
.num-total .num span {
  color: #f00;
}
</style>
