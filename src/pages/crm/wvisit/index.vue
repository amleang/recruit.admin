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
    <base-table tableName="待回访列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
      <template slot-scope="props">
        <div v-if="props.tplName=='toperation'">
          <el-button size="small" type="info" icon="el-icon-view" @click="view_handle(props.row)">查看</el-button>
          <el-button size="small" icon="el-icon-edit" type="primary" @click="editor_handle(props.row)">已回访
          </el-button>
          <el-button size="small" icon="el-icon-delete" type="danger">作废</el-button>
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
      searchForm: { name: "", phone: "", status: 0 },
      queryParams: {
        name: "",
        phone: "",
        status: 0
      },
      table: {
        action: "/api/crm/wvisit",
        heads: [
          { prop: "id", label: "id", type: "data",width:60 },
          { prop: "name", label: "招工名称", type: "data",width:250 },
          { prop: "username", label: "用户名称", type: "data" },
          { prop: "phone", label: "用户电话", type: "data",width:150 },
          { prop: "inviter", label: "邀请人", type: "data" },
          { prop: "inviterCode", label: "邀请人编码", type: "data" },
          { prop: "createAt", label: "创建时间", type: "time" },
          {
            prop: "operation",
            label: "操作",
            type: "comps",
            tplName: "toperation",
            width: 280
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
    editor_handle(row) {
      const postData = {
        id: row.id,
        unionid: row.unionid,
        status: 1,
        inviter: row.inviter,
        inviterPhone: row.inviterPhone,
        remarks: row.remarks
      };
      this.http.post("/api/crm/setvisit", postData).then(res => {
        if (res.code == 200) {
          this.$message.success("成功设置为已回访!");
          this.$refs.table.reload();
        } else this.$message.error(res.msg);
      });
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
