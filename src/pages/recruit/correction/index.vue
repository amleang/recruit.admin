<template>
    <div>
        <base-query @queryhandle="query_handle">
            <el-row :gutter="20">
                <el-col :span="3">
                    <div class="search-title">招工ID</div>
                </el-col>
                <el-col :span="9">
                    <el-input v-model="searchForm.recruitid" style="width:220px;" size="small" placeholder="请输入招工ID"></el-input>
                </el-col>
                <el-col :span="3">
                    <div class="search-title">招工名称</div>
                </el-col>
                <el-col :span="9">
                    <el-input v-model="searchForm.name" style="width:220px;" size="small" placeholder="请输入招工名称"></el-input>
                </el-col>
            </el-row>
        </base-query>
        <base-table tableName="招工纠错列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
            <template slot-scope="props">
                <div v-if="props.tplName=='tpimgs'">
                    <el-tag v-if="props.row.imgs" type="success">有</el-tag>
                    <el-tag v-else type="danger">无</el-tag>
                </div>
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
      searchForm: { recruitid: "", name: "" },
      queryParams: { recruitid: "", name: "" },
      table: {
        action: "/api/correction",
        heads: [
          { prop: "id", label: "id", type: "data", width: 50 },
          { prop: "recruitid", label: "招工ID", type: "data", width: 100 },
          { prop: "name", label: "招工标题", type: "data" },
          { prop: "content", label: "纠错内容", type: "data" },
          {
            prop: "imgs",
            label: "是否有图片",
            type: "comps",
            tplName: "tpimgs",
            width: 100
          },
          { prop: "createAt", label: "创建时间", type: "time", width: 150 },
          {
            prop: "operation",
            label: "操作",
            type: "comps",
            tplName: "toperation",
            width: 200
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
    }
  }
};
</script>

<style>
</style>
