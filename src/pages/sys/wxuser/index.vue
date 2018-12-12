<template>
  <div>
    <base-query @queryhandle="query_handle">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="search-title">昵称</div>
        </el-col>
        <el-col :span="9">
          <el-input v-model="searchForm.nickname" style="width:300px;" size="small" placeholder="请输入昵称"></el-input>
        </el-col>
        <el-col :span="3">
          <div class="search-title">用户名称</div>
        </el-col>
        <el-col :span="9">
          <el-input v-model="searchForm.username" style="width:300px;" size="small" placeholder="请输入用户名称"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top:10px;">
        <el-col :span="3">
          <div class="search-title">手机号</div>
        </el-col>
        <el-col :span="9">
          <el-input v-model="searchForm.phone" style="width:300px;" size="small" placeholder="请输入手机号"></el-input>
        </el-col>
        <el-col :span="3">
          <div class="search-title">状态</div>
        </el-col>
        <el-col :span="9">
          <el-select v-model="searchForm.status" size="small" clearable placeholder="请选择状态" style="width:300px;">
            <el-option label="全部" value></el-option>
            <el-option label="已注册" value="1"></el-option>
            <el-option label="未注册" value="0"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </base-query>
    <base-table tableName="会员列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
      <template slot-scope="props">
        <div v-if="props.tplName=='tpstatus'">{{props.row.status==1?'已注册':'未注册'}}</div>
      </template>
    </base-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        nickname: "",
        username: "",
        status: "",
        phone: ""
      },
      queryParams: {},
      table: {
        action: "/api/user/wxuser",
        heads: [
          { prop: "unionid", label: "unionid", type: "data", width: 270 },
          { prop: "nickname", label: "昵称", type: "data" },
          { prop: "username", label: "用户姓名", type: "data" },
          { prop: "phone", label: "手机号", type: "data" },
          { prop: "idCode", label: "身份证", type: "data", width: 220 },
          { prop: "status", label: "状态", type: "comps", tplName: "tpstatus" },
          { prop: "createAt", label: "创建时间", type: "time" }
        ]
      }
    };
  },
  methods: {
    query_handle() {
      Object.keys(this.searchForm).forEach(item => {
        if (this.searchForm[item])
          this.$set(this.queryParams, item, this.searchForm[item]);
        else delete this.queryParams[item];
      });
      this.$refs.table.reload();
    }
  }
};
</script>

<style>
</style>
