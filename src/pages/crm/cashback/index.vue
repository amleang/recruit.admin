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
    <base-table tableName="待返现列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
      <template slot-scope="props">
        <div v-if="props.tplName=='toperation'">
          <el-button size="small" type="info" icon="el-icon-view" @click="view_handle(props.row)">查看</el-button>
          <el-button size="small" icon="el-icon-plus" type="primary" @click="add_handle(props.row)">添加返现
          </el-button>
          <el-button size="small" icon="el-icon-success" type="danger" @click="end_handle(props.row)">完结</el-button>
        </div>
      </template>
    </base-table>
    <detail-form :formDialog="formDialog" :id="currid" @dialogHandle="dialog_handle"></detail-form>
    <el-dialog title="添加返现记录" :visible.sync="cashbackDialog" top="20vh" width="500px" :modal-append-to-body="false" :close-on-click-modal="false" :before-close="handleClose">
      <el-card>
        <el-form label-width="100px" ref="form">
          <el-form-item label="金额">
            <el-input-number v-model="cashbackForm.price" style="width:250px;" :min="1" :max="99999999" label="返现金额"></el-input-number>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="cashbackForm.remarks" style="width:250px;" maxlength="100" type="textarea" :rows="3" placeholder="请输入备注">
            </el-input>
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
            prop: "lastcashback",
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
      },
      cashbackDialog: false,
      cashbackForm: {
        price: 100,
        remarks: ""
      },
      localrow: null
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
    add_handle(row) {
      this.cashbackForm = {
        price: 100,
        remarks: ""
      };
      this.cashbackDialog = true;
      this.localrow = row;
    },
    end_handle(row) {
      this.$confirm("确定要设置该信息为已完结吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const postData = {
            id: row.id,
            unionid: row.unionid,
            status: 4,
            inviter: row.inviter,
            inviterPhone: row.inviterPhone,
            remarks: row.remarks,
            entryAt: row.entryAt
          };
          this.http.post("/api/crm/setenroll", postData).then(res => {
            if (res.code == 200) {
              if (status == 3) this.$message.success("成功设置为已完结!");
              else this.$message.success("成功设置为已完结!");
              this.$refs.table.reload();
            } else this.$message.error(res.msg);
          });
        })
        .catch(() => {});
    },
    dialog_handle(res) {
      this.formDialog = res.dialog;
      if (res.isreload) this.$refs.table.reload();
    },
    handleClose() {
      this.cashbackDialog = false;
    },
    save_handle() {
      let postData = {
        enrollid: this.localrow.id,
        unionid: this.localrow.unionid,
        price: this.cashbackForm.price,
        remarks: this.cashbackForm.remarks
      };
      this.http.post("/api/cashback", postData).then(res => {
        if (res.code == 200) {
          this.$message.success("添加返现记录成功！");
          this.cashbackDialog = false;
        } else this.$message.error(res.msg);
      });
    }
  }
};
</script>

<style>
</style>
