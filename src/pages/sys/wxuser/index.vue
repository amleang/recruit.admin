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
        <div v-if="props.tplName=='tpblacklist' && props.row.status==1">{{props.row.isblacklist==0?'否':'是'}}</div>
        <div v-if="props.tplName=='toperation'">
          <el-button size="small" v-if="props.row.isblacklist==1 && props.row.status==1" type="success" @click="set_handle(props.row,0)">设置白名单
          </el-button>
          <el-button size="small" v-if="props.row.isblacklist==0 && props.row.status==1" type="info" @click="set_handle(props.row,1)">设置黑名单
          </el-button>
        </div>
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
          {
            prop: "isblacklist",
            label: "黑名单",
            type: "comps",
            tplName: "tpblacklist"
          },
          { prop: "createAt", label: "创建时间", type: "time" },
          {
            prop: "operation",
            label: "操作",
            type: "comps",
            tplName: "toperation",
            width: 150
          }
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
    },
    set_handle(row, type) {
      const postData = {
        unionid: row.unionid,
        type: type
      };
      this.http.post("/api/user/setwxuser", postData).then(res => {
        if (res.code == 200) {
          this.$message.success("设置成功");
          this.$refs.table.reload();
        } else this.$message.error(res.msg);
      });
    }
  }
};
</script>

<style>
</style>
