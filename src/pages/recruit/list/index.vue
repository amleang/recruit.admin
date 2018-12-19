<template>
  <div>
    <base-query @queryhandle="query_handle">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="search-title">名称</div>
        </el-col>
        <el-col :span="9">
          <el-input v-model="searchForm.name" style="width:220px;" size="small" placeholder="请输入名称"></el-input>
        </el-col>
        <el-col :span="3">
          <div class="search-title">活动状态</div>
        </el-col>
        <el-col :span="9">
          <el-select v-model="searchForm.active" style="width:220px;" size="small" clearable placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用招聘" value="1"></el-option>
            <el-option label="停止招聘" value="0"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top:10px;">
        <el-col :span="3">
          <div class="search-title">置顶</div>
        </el-col>
        <el-col :span="9">
          <el-select v-model="searchForm.isTop" style="width:220px;" size="small" clearable placeholder="请选择是否置顶">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <div class="search-title">状态</div>
        </el-col>
        <el-col :span="9">
          <el-select v-model="searchForm.status" style="width:220px;" size="small" clearable placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="开启" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </base-query>
    <base-table tableName="招工列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
      <div slot="button">
        <el-button size="small" icon="el-icon-plus" type="success" @click="add_handle">添加</el-button>
      </div>
      <template slot-scope="props">
        <div v-if="props.tplName=='tpsalary'">
          {{props.row.salaryStart}}-{{props.row.salaryEnd}}
        </div>
        <div v-if="props.tplName=='tpactive'">
          <el-tag v-if="props.row.active==1" type="success">启用招聘</el-tag>
          <el-tag v-else type="danger">停止招聘</el-tag>
        </div>
        <div v-if="props.tplName=='tpstatus'">
          <el-tag v-if="props.row.status==1" type="success">开启</el-tag>
          <el-tag v-else type="danger">关闭</el-tag>
        </div>
        <div v-if="props.tplName=='tpisTop'">
          <el-tag v-if="props.row.isTop==1" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </div>
        <div v-if="props.tplName=='tptype'">
          {{props.row.type==0?'无':props.row.type==1?'工价':'补贴'}}
        </div>
        <div v-if="props.tplName=='toperation'">
          <el-button size="small" type="danger" v-if="props.row.active==1" @click="active_handle(props.row)">停止招聘</el-button>
          <el-button size="small" type="success" v-else @click="active_handle(props.row)">启用招聘</el-button>
          <el-button size="small" type="danger" v-if="props.row.status==1" @click="status_handle(props.row)">关闭</el-button>
          <el-button size="small" type="success" v-else @click="status_handle(props.row)">开启</el-button>
          <el-button size="small" v-if="props.row.role!=1" icon="el-icon-edit" type="primary" @click="editor_handle(props.row)">编辑
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
      currid: 0,
      formDialog: false,
      queryParams: { name: "", active: "", isTop: "", status: "" },
      searchForm: { name: "", active: "", isTop: "", status: "" },
      table: {
        action: "/api/recruit",
        heads: [
          { prop: "id", label: "id", type: "data", width: 50 },
          { prop: "name", label: "标题", type: "data" },
          { prop: "subname", label: "副标题", type: "data" },
          {
            prop: "salaryStart",
            label: "薪资",
            type: "comps",
            tplName: "tpsalary"
          },
          { prop: "createAt", label: "创建时间", type: "time" },
          {
            prop: "isTop",
            label: "是否置顶",
            type: "comps",
            tplName: "tpisTop"
          },
          { prop: "type", label: "类型", type: "comps", tplName: "tptype" },
          {
            prop: "active",
            label: "活动状态",
            type: "comps",
            tplName: "tpactive"
          },
          { prop: "status", label: "状态", type: "comps", tplName: "tpstatus" },
          { prop: "weight", label: "排序", type: "data", width: 50 },
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
    add_handle() {
      this.currid = 0;
      this.formDialog = true;
    },
    editor_handle(row) {
      this.currid = row.id;
      this.formDialog = true;
    },
    active_handle(row) {
      const active = row.active == 1 ? 0 : 1;
      const id = row.id;
      this.http
        .post("/api/recruit/active?id=" + id + "&active=" + active)
        .then(res => {
          if (res.code == 200) {
            row.active = active;
            if (active == 1) this.$messge.success("已启用招聘");
            else this.$message.success("已停止招聘");
          } else this.$message.error(res.msg);
        });
    },
    status_handle(row) {
      const status = row.status == 1 ? 0 : 1;
      const id = row.id;
      this.http
        .post("/api/recruit/status?id=" + id + "&status=" + status)
        .then(res => {
          if (res.code == 200) {
            row.status = status;
            if (status == 1) this.$messge.success("已开启");
            else this.$message.success("已关闭");
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
