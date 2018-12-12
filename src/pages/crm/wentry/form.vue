<template>
  <el-dialog title="待入职详情" :visible.sync="formDialog" top="20vh" width="900px" :modal-append-to-body="false" :close-on-click-modal="false" :before-close="handleClose">
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
          <el-input v-model="form.inviter" size="small" maxlength="50" placeholder="邀请人"></el-input>
        </el-form-item>
        <el-form-item label="邀请人电话">
          <el-input v-model="form.inviterPhone" size="small" maxlength="50" placeholder="邀请人电话"></el-input>
        </el-form-item>
        <el-form-item label="邀请码">
          <el-input v-model="form.inviterCode" disabled size="small" maxlength="50" placeholder="邀请码"></el-input>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker v-model="form.entryAt" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否黑名单">
          <el-switch v-model="form.isblacklist" disabled active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否">
          </el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remarks" type="textarea" maxlength="100" :rows="3" placeholder="请输入备注">
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="induction_handle(3)">待返现</el-button>
      <el-button type="danger" @click="induction_handle(4)">已完结</el-button>
    </div>
  </el-dialog>
</template>

<script>
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
    handleClose() {
      this.$emit("dialogHandle", { dialog: false, isreload: this.isUpdate });
    },

    induction_handle(status) {
      if (!this.form.entryAt) {
        this.$message.warning("请设置入职时间");
        return;
      }
      const postData = {
        id: this.id,
        unionid: this.form.unionid,
        status: status,
        inviter: this.form.inviter,
        inviterPhone: this.form.inviterPhone,
        remarks: this.form.remarks,
        entryAt: this.form.entryAt
      };
      this.http.post("/api/crm/setenroll", postData).then(res => {
        if (res.code == 200) {
          if (status == 3) this.$message.success("成功设置为待返现!");
          else this.$message.success("成功设置为已完结!");
          this.$emit("dialogHandle", { dialog: false, isreload: true });
        } else this.$message.error(res.msg);
      });
    }
  },
  watch: {
    formDialog() {
      if (this.formDialog) {
        this.http.get("/api/crm/wvisititem/" + this.id).then(res => {
          this.form = res.data;
        });
      }
    }
  }
};
</script>

<style>
</style>
