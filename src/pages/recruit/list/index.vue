<template>
    <div>
        <base-query @queryhandle="query_handle">
            <el-row :gutter="20">
                <el-col :span="3">
                    <div class="search-title">名称</div>
                </el-col>
                <el-col :span="9">
                    <el-input v-model="searchForm.username" style="width:300px;" size="small" placeholder="请输入名称"></el-input>
                </el-col>
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
            </el-row>
        </base-query>
        <base-table tableName="招工列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
            <div slot="button">
                <el-button size="small" icon="el-icon-plus" type="success" @click="add_handle">添加</el-button>
            </div>
            <!-- <template slot-scope="props">
                <div v-if="props.tplName=='tpactive'">
                    {{props.row.active==1?'启用':'禁用'}}
                </div>
                <div v-if="props.tplName=='tprole'">
                    {{props.row.role==1?'管理员':'推销员'}}
                </div>
                <div v-if="props.tplName=='toperation'">
                    <el-button size="small" type="danger" v-if="props.row.active==1" @click="enable_handle(props.row,0)">禁用</el-button>
                    <el-button size="small" type="success" v-else @click="enable_handle(props.row,1)">启用</el-button>
                    <el-button size="small" v-if="props.row.role!=1" icon="el-icon-edit" type="primary" @click="editor_handle(props.row)">编辑
                    </el-button>
                </div>
            </template> -->
        </base-table>
        <detail-form :formDialog="formDialog" :id="currid" @dialogHandle="dialog_handle"></detail-form>
    </div>
</template>

<script>
import detailForm from "./form";

export default {
  components: {
    detailForm,
  },
  data() {
    return {
      currid: 0,
      formDialog: false,
      queryParams: {},
      searchForm: {},
      table: {}
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
