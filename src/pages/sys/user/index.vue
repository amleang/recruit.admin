<template>
  <div>
    <base-query @queryhandle="query_handle">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="search-title">状态</div>
        </el-col>
        <el-col :span="9">
          <el-select v-model="searchForm.active" size="small" clearable placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="启动" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
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
          <div class="search-title">角色</div>
        </el-col>
        <el-col :span="9">
          <el-select v-model="searchForm.role" size="small" clearable placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="管理员" value="1"></el-option>
            <el-option label="推销员" value="2"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </base-query>
    <base-table tableName="用户列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
      <div slot="button">
        <el-button size="small" icon="el-icon-plus" type="success" @click="add_handle">添加</el-button>
      </div>
      <template slot-scope="props">
        <div v-if="props.tplName=='tpactive'">
          {{props.row.active==1?'启用':'禁用'}}
        </div>
        <div v-if="props.tplName=='tprole'">
          {{props.row.role==1?'管理员':'推销员'}}
        </div>
        <div v-if="props.tplName=='toperation'">
          <el-button size="small" type="danger" v-if="props.row.active==1">禁用</el-button>
          <el-button size="small" type="success" v-else>启用</el-button>
          <el-button size="small" v-if="props.row.role!=1" icon="el-icon-edit" type="primary">编辑
          </el-button>
        </div>
      </template>
    </base-table>
    <detail-form :formDialog="formDialog" :id="currid" @dialogHandle="dialog_handle"></detail-form>
  </div>
</template>

<script>
import detailForm from "./form";
export default {
  components: {
    detailForm
  },
  data() {
    return {
      searchForm: {
        username: "",
        active: "",
        role: ""
      },
      queryParams: {},
      table: {
        action: "/api/user",
        heads: [
          { prop: "id", label: "id", type: "data" },
          { prop: "username", label: "用户名称", type: "data" },
          { prop: "relname", label: "真实名称", type: "data" },
          { prop: "role", label: "角色", type: "comps", tplName: "tprole" },
          { prop: "active", label: "状态", type: "comps", tplName: "tpactive" },
          { prop: "invitationCode", label: "邀请码", type: "data" },
          { prop: "createAt", label: "创建时间", type: "time" },
          {
            prop: "operation",
            label: "操作",
            type: "comps",
            tplName: "toperation",
            width: 200
          }
        ]
      },
      formDialog: false,
      currid: 0
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
      console.log("test=>", this.queryParams);
      /* if (this.searchForm.active)
      this.$set
        this.queryParams.active = this.searchForm.active;
      else delete this.queryParams.active; */
    },
    add_handle() {
      this.currid = 0;
      this.formDialog = true;
    },
    dialog_handle(res) {
      this.formDialog = res.dialog;
      if (res.isreload) this.$refs.table.reload();
    }
  }
};
</script>

<style>
</style>
