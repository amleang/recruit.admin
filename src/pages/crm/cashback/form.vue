<template>
  <el-dialog title="待返现详情" :visible.sync="formDialog" top="20vh" width="900px" :append-to-body="true" :close-on-click-modal="false" :before-close="handleClose">
    <el-card>
      <el-form label-width="90px" ref="form">
        <el-form-item label="招工名称">
          <el-input v-model="form.name" disabled size="small" maxlength="50" placeholder="招工名称"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.username" disabled size="small" maxlength="50" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户电话">
          <el-input v-model="form.phone" disabled size="small" maxlength="50" placeholder="用户电话"></el-input>
        </el-form-item>
        <el-form-item label="邀请人">
          <el-input v-model="form.inviter" disabled size="small" maxlength="50" placeholder="邀请人"></el-input>
        </el-form-item>
        <el-form-item label="邀请人电话">
          <el-input v-model="form.inviterPhone" disabled size="small" maxlength="50" placeholder="邀请人电话"></el-input>
        </el-form-item>
        <el-form-item label="邀请码">
          <el-input v-model="form.inviterCode" disabled size="small" maxlength="50" placeholder="邀请码"></el-input>
        </el-form-item>
        <el-form-item label="银行">
          <el-input v-model="form.bank" disabled size="small" maxlength="50" placeholder="银行"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="form.cardNumber" disabled size="small" maxlength="50" placeholder="银行卡号"></el-input>
        </el-form-item>
        <el-form-item label="是否黑名单">
          <el-switch v-model="form.isblacklist" disabled active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" disabled type="textarea" :rows="3" placeholder="请输入备注">
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-if="form.otherdata.length>0" style="margin-top:20px;">
      <div slot="header">
        <span>返现记录列表</span>
      </div>
      <div>
        <el-table :data="form.otherdata" style="width: 100%">
          <el-table-column prop="price" label="金额" width="150">
          </el-table-column>
          <el-table-column prop="createAt" label="返现时间" width="200">
            <template slot-scope="scope">
              {{formatDate(scope.row.createAt)}}
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="描述">
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button size="small" icon="el-icon-delete" type="danger" @click="delete_handle(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formatDate } from "@/components/lib/util";
export default {
  props: {
    id: {
      type: Number,
      default: 0
    },
    formDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isUpdate: false,
      form: {
        otherdata: []
      }
    };
  },
  methods: {
    formatDate,
    handleClose() {
      this.$emit("dialogHandle", { dialog: false, isreload: this.isUpdate });
    },
    delete_handle(scope) {
      this.$confirm("确定要删除该返现记录吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.http
            .delete("/api/cashback/" + scope.row.id, { params: { type: 0 } })
            .then(res => {
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.form.otherdata.splice(scope.$index, 1);
              } else this.$message.error(res.msg);
            });
        })
        .catch(() => {});
    }
  },
  watch: {
    formDialog() {
      if (this.formDialog) {
        this.http.get("/api/crm/wcashbackitem/" + this.id).then(res => {
          this.form = res.data;
        });
      }
    }
  }
};
</script>

<style>
</style>
