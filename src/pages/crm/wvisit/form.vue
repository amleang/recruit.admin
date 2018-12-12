<template>
  <el-dialog title="回访详情" :visible.sync="formDialog" top="20vh" width="900px" :append-to-body="true" :close-on-click-modal="false" :before-close="handleClose">
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
    <el-card v-if="form.otherdata.length>0" style="margin-top:20px;">
      <div slot="header">
        <span>其他报名列表</span>
      </div>
      <div>
        <el-table :data="form.otherdata" style="width: 100%">
          <el-table-column prop="name" label="招工名称" width="360">
          </el-table-column>
          <el-table-column prop="inviter" label="邀请人" width="180">
          </el-table-column>
          <el-table-column prop="inviterCode" label="邀请编码">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="small" icon="el-icon-delete" type="danger" @click="invalid_handle(scope)">作废</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="visit_handle">已回访</el-button>
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
    invalid_handle(scope) {
      this.$confirm("确定作废该报名信息吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.http.post("/api/crm/invalid/" + scope.row.id).then(res => {
            if (res.code == 200) {
              this.isUpdate = true;
              this.$message({
                message: "作废成功！",
                type: "success"
              });
              this.form.otherdata.splice(scope.$index, 1);
            } else this.$message.error(res.msg);
          });
        })
        .catch(() => {});
    },
    visit_handle() {
      const postData = {
        id: this.id,
        unionid: this.form.unionid,
        status: 1,
        inviter: this.form.inviter,
        inviterPhone: this.form.inviterPhone,
        remarks: this.form.remarks
      };
      this.http.post("/api/crm/setvisit", postData).then(res => {
        if (res.code == 200) {
          this.$message.success("成功设置为已回访!");
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
