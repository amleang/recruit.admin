<template>
    <div>
        <base-query @queryhandle="query_handle">
            <el-row :gutter="20">
                <el-col :span="3">
                    <div class="search-title">招工名称</div>
                </el-col>
                <el-col :span="9">
                    <el-input v-model="searchForm.name" style="width:300px;" size="small" placeholder="请输入招工名称"></el-input>
                </el-col>
                <el-col :span="3">
                    <div class="search-title">手机号</div>
                </el-col>
                <el-col :span="9">
                    <el-input v-model="searchForm.phone" style="width:300px;" size="small" placeholder="请输入手机号"></el-input>
                </el-col>
            </el-row>
        </base-query>
        <base-table tableName="已完结列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
            <template slot-scope="props">
                <div v-if="props.tplName=='toperation'">
                    <el-button size="small" type="info" icon="el-icon-view" @click="view_handle(props.row)">查看</el-button>
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
      currid: 0,
      formDialog: false,
      searchForm: {
        name: "",
        phone: "",
        status: 4
      },
      queryParams: {
        name: "",
        phone: "",
        status: 4
      },
      table: {
        action: "/api/crm/enrolllist",
        heads: [
          { prop: "id", label: "id", type: "data", width: 60 },
          { prop: "name", label: "招工名称", type: "data", width: 250 },
          { prop: "username", label: "用户名称", type: "data" },
          { prop: "phone", label: "用户电话", type: "data", width: 150 },
          { prop: "inviter", label: "邀请人", type: "data" },
          { prop: "inviterCode", label: "邀请人编码", type: "data" },
          { prop: "updateAt", label: "完结时间", type: "time" },
          {
            prop: "operation",
            label: "操作",
            type: "comps",
            tplName: "toperation",
            width: 120
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
    view_handle(row) {
      this.currid = row.id;
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
