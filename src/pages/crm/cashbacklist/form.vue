<template>
    <el-dialog title="选择待返现记录" :visible.sync="formDialog2" top="20vh" width="900px" :append-to-body="true" :fullscreen="true" :close-on-click-modal="false" :before-close="handleClose">
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
        <base-table v-if="formDialog2" tableName="待返现列表" ref="table2" :action="table.action" :columns="table.heads" :queryParams="queryParams">
            <template slot-scope="props">
                <div v-if="props.tplName=='toperation'">
                    <el-button size="small" type="success" icon="el-icon-check" @click="ok_handle(props.row)">确认</el-button>
                </div>
            </template>
        </base-table>
    </el-dialog>
</template>

<script>
export default {
  props: {
    formDialog2: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchForm: {
        name: "",
        phone: "",
        status: 3
      },
      queryParams: {
        name: "",
        phone: "",
        status: 3
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
          { prop: "entryAt", label: "入职时间", type: "time", width: 120 },
          {
            prop: "lastcashbackAt",
            label: "返现时间",
            type: "time",
            width: 120
          },
          {
            prop: "operation",
            label: "操作",
            type: "comps",
            tplName: "toperation",
            width: 300
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
        else {
          if (item != "status") delete this.queryParams[item];
        }
      });
      this.$refs.table2.reload();
    },
    handleClose() {
      this.$emit("dialogHandle", { dialog: false, isreload: this.isUpdate });
    },
    ok_handle() {}
  },
  watch: {
    formDialog2() {
      if (this.formDialog2) {
        this.$refs.table2.reload();
      }
    }
  }
};
</script>

<style>
</style>
