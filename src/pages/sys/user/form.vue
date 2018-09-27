<template>
  <el-dialog title="用户表单" :visible.sync="formDialog" top="20vh" width="600px" append-to-body :close-on-click-modal="false" :before-close="handle_Close">
    <el-form ref="form" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="用户名" prop="username">
        <el-input size="small" :disabled="form.id!=0" v-model="form.username" maxlength="50" style="width:300px;" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="relname">
        <el-input size="small" v-model="form.relname" maxlength="50" style="width:300px;" placeholder="请输入真实姓名"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="active">
        <el-select size="small" style="width:300px;" v-model="form.active" placeholder="--请选择--">
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.id==0" label="角色" prop="role">
        <el-select size="small" style="width:300px;" v-model="form.role" placeholder="--请选择--">
          <el-option label="管理员" :value="1"></el-option>
          <el-option label="推销员" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="id!=0 && form.role==2" label="邀请码">
        <el-input v-model="form.invitationCode" disabled style="width:300px;" size="small"></el-input>
      </el-form-item>
    </el-form>
    <div v-if="id==0 &&form.role==1" style="padding: 0px 150px;color: #f00;">初始密码为“123”</div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handle_Close">取消</el-button>
      <el-button type="primary" @click="confirm_handle">确认</el-button>
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
      entList: [],
      form: {
        id: 0,
        username: "",
        relname: "",
        active: 1,
        role: 2,
        invitationCode: ""
      },
      rules: {
        username: [{ required: true, message: "请输入用户名" }],
        relname: [{ required: true, message: "请输入真实姓名" }],
        active: [{ required: true, message: "请设置状态" }],
        role: [{ required: true, message: "请选择角色" }]
      }
    };
  },
  methods: {
    handle_Close() {
      this.$refs["form"].resetFields();
      this.$emit("dialogHandle", { dialog: false, isreload: false });
    },
    confirm_handle() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.id == 0) {
            this.http.post("/api/user", this.form).then(res => {
              if (res.code == 200) {
                this.$emit("dialogHandle", { dialog: false, isreload: true });
                this.$message.success("添加成功!");
                this.$refs["form"].resetFields();
              } else this.$message.error(res.msg);
            });
          } else {
            this.http.put("/api/user", this.form).then(res => {
              if (res.code == 200) {
                this.$emit("dialogHandle", { dialog: false, isreload: true });
                this.$message.success("修改成功!");
                this.$refs["form"].resetFields();
              } else this.$message.error(res.msg);
            });
          }
        }
      });
    }
  },
  watch: {
    formDialog() {
      if (this.formDialog) {
        if (this.id == 0) {
          this.form = {
            id: 0,
            username: "",
            relname: "",
            active: 1,
            role: 2,
            invitationCode: ""
          };
        } else {
          this.http.get("/api/user/" + this.id).then(res => {
            if (res.code == 200) {
              this.form = res.data;
            }
          });
        }
      }
    }
  }
};
</script>

<style>
</style>
