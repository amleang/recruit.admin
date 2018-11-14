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
        <base-table tableName="返现记录列表" ref="table" :action="table.action" :columns="table.heads" :queryParams="queryParams">
            <div slot="button">
                <el-button size="small" icon="el-icon-plus" type="success" @click="add_handle">添加</el-button>
            </div>
            <template slot-scope="props">
                <div v-if="props.tplName=='toperation'">
                    <el-button size="small" v-if="props.row.name!=''" icon="el-icon-delete" type="danger" @click="editor_handle(props.row)">删除
                    </el-button>
                    <el-button size="small" v-else icon="el-icon-delete" type="danger" @click="editor_handle(props.row)">作废
                    </el-button>
                </div>
                <div v-if="props.tplName=='tptype'">
                    {{props.row.name==''?'推荐记录':'返现记录'}}
                </div>

            </template>
        </base-table>
        <el-dialog title="添加返现记录" :visible.sync="cashbackDialog" top="20vh" width="500px" :append-to-body="true" :close-on-click-modal="false" :before-close="handleClose">
            <el-card>
                <el-form label-width="100px" ref="form">
                    <el-form-item label="待返现记录">
                        <el-select v-model="form.enrollid" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="remoteMethod" :loading="loading">
                            <el-option v-for="item in cashbacklist" :key="item.id" :label="item.username" :value="`${item.id+'|'+item.unionid}`">
                                <span style="float: left">{{ item.id }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="金额">
                        <el-input-number v-model="form.price" style="width:250px;" :min="1" :max="99999999" label="返现金额"></el-input-number>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="form.remarks" style="width:250px;" maxlength="100" type="textarea" :rows="3" placeholder="请输入备注">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="save_handle">确定</el-button>
            </div>
        </el-dialog>
        <!--   <detail-form :formDialog2="formDialog" @dialogHandle="dialog_handle"></detail-form> -->
    </div>
</template>

<script>
/* import detailForm from "./form"; */
export default {
  /* components: {
    detailForm
  }, */
  data() {
    return {
      cashbackDialog: false,
      loading: false,
      cashbacklist: [],
      form: {
        price: 100,
        remarks: ""
      },
      searchForm: {
        name: "",
        phone: ""
      },
      queryParams: {
        enrollid: "",
        name: "",
        phone: ""
      },
      table: {
        action: "/api/cashback",
        heads: [
          { prop: "id", label: "id", type: "data", width: 60 },
          { prop: "name", label: "招工名称", type: "data" },
          { prop: "username", label: "用户名称", type: "data", width: 150 },
          { prop: "phone", label: "用户电话", type: "data", width: 150 },
          { prop: "createAt", label: "创建时间", type: "time", width: 120 },
          { prop: "remarks", label: "类型", type: "comps", tplName: "tptype" },
          { prop: "price", label: "金额", type: "data" },
          { prop: "remarks", label: "备注", type: "data" },
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
    add_handle() {
      this.form = {
        price: 100,
        remarks: ""
      };
      this.cashbackDialog = true;
    },
    handleClose() {
      this.cashbackDialog = false;
    },
    remoteMethod(val) {
      this.http
        .get("/api/crm/enrolllist", { phone: val, status: 3 })
        .then(res => {
          this.cashbacklist = res.data;
          console.log("res=>phone=>", res);
        });
    },
    editor_handle(row) {
      let type = 0;
      let msg = "确定要删除该返现记录吗, 是否继续?";
      if (row.name == "") {
        type = 1;
        msg = "确定要作废该推荐记录吗, 是否继续?";
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.http
            .delete("/api/cashback/" + row.id, { params: { type: type } })
            .then(res => {
              if (res.code == 200) {
                if (type == 0) this.$message.success("删除成功！");
                else this.$message.success("作废成功！");
                this.$refs.table.reload();
              } else this.$message.error(res.msg);
            });
        })
        .catch(() => {});
    },
    /*  dialog_handle(res) {
        this.formDialog = res.dialog;
    }, */
    save_handle() {
      if (!this.form.enrollid) {
        this.$message.warning("请选择待返现记录");
        return;
      }
      let arr = this.form.enrollid.split("|");
      let postData = {
        enrollid: arr[0],
        unionid: arr[1],
        price: this.form.price,
        remarks: this.form.remarks
      };
      this.http.post("/api/cashback", postData).then(res => {
        if (res.code == 200) {
          this.$message.success("添加返现记录成功！");
          this.cashbackDialog = false;
          this.$refs.table.reload();
        } else this.$message.error(res.msg);
      });
    }
  }
};
</script>

<style>
</style>
