<template>
  <div>
    <base-query @queryhandle="query_handle">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="search-title">企业名称</div>
        </el-col>
        <el-col :span="9">
          <el-input v-model="searchForm.name" style="width:300px;" size="small" placeholder="请输入企业名称"></el-input>
        </el-col>
      </el-row>
    </base-query>
    <base-table tableName="企业列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
      <div slot="button">
        <el-button size="small" icon="el-icon-plus" type="success" @click="add_handle">添加</el-button>
      </div>
      <template slot-scope="props">
        <div v-if="props.tplName=='toperation'">
          <el-button size="small" icon="el-icon-edit" type="primary">编辑</el-button>
          <el-button size="small" icon="el-icon-delete" type="danger">删除</el-button>
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
        name: ""
      },
      queryParams: {},
      table: {
        action: "/api/ent",
        heads: [
          { prop: "id", label: "id", type: "data" },
          { prop: "name", label: "企业名称", type: "data" },
          { prop: "cover", label: "封面", type: "data" },
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
    query_handle() {},
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
