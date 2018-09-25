<template>
  <div>
    <base-query>
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="search-title">用户名称</div>
        </el-col>
        <el-col :span="9">
          <el-input v-model="searchForm.username" size="small" placeholder="请输入用户名称"></el-input>
        </el-col>
        <el-col :span="3">
          <div class="search-title">状态</div>
        </el-col>
        <el-col :span="9">
          <el-select v-model="searchForm.active" size="small" clearable placeholder="请选择状态">
            <el-option key="" value="全部"></el-option>
            <el-option key="1" value="启动"></el-option>
            <el-option key="0" value="禁用"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top:10px;">
        <el-col :span="3">
          <div class="search-title">
            <div class="search-title">企业名称</div>
          </div>
        </el-col>
        <el-col :span="9">
          <el-input v-model="searchForm.entname" size="small" placeholder="请输入企业名称"></el-input>
        </el-col>
      </el-row>
    </base-query>
    <base-table tableName="用户列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
      <template slot-scope="props">
        <div v-if="props.tplName=='toperation'">
          <el-button size="small" icon="el-icon-edit" type="primary">编辑
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
        username: "",
        active: "",
        entname: ""
      },
      queryParams: { username: "" },
      table: {
        action: "/api/user",
        heads: [
          { prop: "id", label: "id", type: "data" },
          { prop: "username", label: "用户名称", type: "data" },
          { prop: "relname", label: "真实名称", type: "data" },
          { prop: "entname", label: "企业", type: "data" },
          { prop: "roleName", label: "角色", type: "data" },
          { prop: "createAt", label: "创建时间", type: "time" },
          {
            prop: "operation",
            label: "操作",
            type: "comps",
            tplName: "toperation",
            width: 250
          }
        ]
      }
    };
  },
  methods: {
    query_handle() {
      //this.$refs.table.reload();
    }
  }
};
</script>

<style>
</style>
