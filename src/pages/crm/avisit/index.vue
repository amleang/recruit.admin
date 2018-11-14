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
    <base-table tableName="已回访列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
      <template slot-scope="props">
        <div v-if="props.tplName=='toperation'">
          <el-button size="small" icon="el-icon-edit" type="primary" @click="editor_handle(props.row)">编辑
          </el-button>
          <el-button size="small" icon="el-icon-delete" type="danger" @click="invalid_handle(props.row)">作废</el-button>
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
        status: 1
      },
      queryParams: {
        name: "",
        phone: "",
        status: 1
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
          { prop: "createAt", label: "回访时间", type: "time" },
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
    editor_handle(row) {
      this.currid = row.id;
      this.formDialog = true;
    },
    invalid_handle(row) {
      this.$confirm("确定作废该报名信息吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.http.post("/api/crm/invalid/" + row.id).then(res => {
            if (res.code == 200) {
              this.$message({
                message: "作废成功！",
                type: "success"
              });
              this.$refs.table.reload();
            } else this.$message.error(res.msg);
          });
        })
        .catch(() => {});
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
