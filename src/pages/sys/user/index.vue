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
          <el-button size="small" type="warning" v-if="props.row.active==1" @click="enable_handle(props.row,0)">禁用</el-button>
          <el-button size="small" type="success" v-else @click="enable_handle(props.row,1)">启用</el-button>
          <el-button size="small" v-if="props.row.role==1" type="primary" icon="el-icon-refresh" @click="repwd_handle(props.row)">重置密码</el-button>
          <el-button size="small" v-if="props.row.role!=1" icon="el-icon-edit" type="primary" @click="editor_handle(props.row)">编辑
          </el-button>
          <el-button size="small" v-if="props.row.role!=1" icon="el-icon-delete" type="danger" @click="del_handle(props.row)">删除
          </el-button>
        </div>
      </template>
    </base-table>
    <detail-form :formDialog="formDialog" :id="currid" @dialogHandle="dialog_handle"></detail-form>
  </div>
</template>

<script>
import detailForm from "./form";
import _ from "lodash";
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
            width: 280
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
    },
    add_handle() {
      this.currid = 0;
      this.formDialog = true;
    },
    editor_handle(row) {
      this.currid = row.id;
      this.formDialog = true;
    },
    del_handle(row) {
      this.$confirm("确定要删除该用户吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.http.delete("/api/user/" + row.id).then(res => {
            if ((res.code = 200)) {
              this.$message.success("删除成功！");
              this.$refs.table.reload();
            } else this.$message.error(res.msg);
          });
        })
        .catch(() => {});
    },
    enable_handle(row, active) {
      let form = _.assign({}, row);
      delete form.createAt;
      form.active = active;
      this.http.put("/api/user", form).then(res => {
        if (res.code == 200) {
          row.active = active;
        } else this.$message.error(res.msg);
      });
    },
    dialog_handle(res) {
      this.formDialog = res.dialog;
      if (res.isreload) this.$refs.table.reload();
    },
    repwd_handle(row) {
      this.$prompt("请输入您要重置的密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: "请输入密码"
      })
        .then(({ value }) => {
         const postData={
           id:row.id,
           pwd:value
         }
         this.http.post("/api/user/resetpwd",postData).then(res=>{
           if(res.code==200){
             this.$message.success("密码重置成功！");
           }
           else
            this.$message.error(res.msg);
         })
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
</style>
