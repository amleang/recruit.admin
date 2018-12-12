<template>
  <div>
    <base-query @queryhandle="query_handle">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="search-title">状态</div>
        </el-col>
        <el-col :span="9">
          <el-select v-model="searchForm.status" size="small" clearable placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="未返现" value="0"></el-option>
            <el-option label="已返现" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <div class="search-title">手机号</div>
        </el-col>
        <el-col :span="9">
          <el-input v-model="searchForm.phone1" style="width:300px;" size="small" placeholder="请输入手机号"></el-input>
        </el-col>
      </el-row>
    </base-query>
    <base-table tableName="推荐列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
      <template slot-scope="props">
        <div v-if="props.tplName=='tpstatus'">
          {{props.row.status==0?'未返现':'已返现'}}
        </div>
        <div v-if="props.tplName=='toperation'">
          <el-button size="small" v-if="props.row.status==0" type="success" icon="el-icon-check" @click="setback_handle(props.row)">确认返现</el-button>
        </div>
      </template>
    </base-table>
    <el-dialog title="设置返现金额" :visible.sync="dialog" top="20vh" width="500px" :append-to-body="true" :close-on-click-modal="false" :before-close="handleClose">
      <el-card>
        <el-form label-width="100px" ref="form">
          <el-form-item label="金额">
            <el-input-number v-model="form.price" style="width:250px;" :min="1" :max="99999999" label="金额"></el-input-number>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="save_handle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        status: "",
        phone1: ""
      },
      queryParams: {
        status: "",
        phone1: ""
      },
      form: {
        price: 100
      },
      dialog: false,
      localrow: null,
      table: {
        action: "/api/crm/recommend",
        heads: [
          { prop: "id", label: "id", type: "data", width: 60 },
          { prop: "username1", label: "用户名称", type: "data" },
          { prop: "phone1", label: "用户电话", type: "data" },
          { prop: "username", label: "推荐人", type: "data" },
          { prop: "phone", label: "推荐人手机号", type: "data" },
          { prop: "price", label: "金额", type: "data" },
          { prop: "createAt", label: "创建时间", type: "time" },
          { prop: "updateAt", label: "返现时间", type: "time" },
          { prop: "status", label: "状态", type: "comps", tplName: "tpstatus" },
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
    handleClose() {
      this.dialog = false;
    },

    setback_handle(row) {
      this.dialog = true;
      this.localrow = row;
      this.form = {
        price: 100
      };
    },
    save_handle() {
      const postData = {
        status: 1,
        id: this.localrow.id,
        price: this.form.price
      };
      this.http.post("/api/crm/setrecommend", postData).then(res => {
        if (res.code == 200) {
          this.$message.success("设置成功！");
          this.dialog = false;
          this.$refs.table.reload();
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }
};
</script>

<style>
</style>
