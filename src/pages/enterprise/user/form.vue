<template>
  <el-dialog title="用户表单" :visible.sync="formDialog" top="20vh" width="600px" append-to-body :close-on-click-modal="false" :before-close="handle_Close">
    <el-form ref="form" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="用户名" prop="username">
        <el-input size="small" v-model="form.username" maxlength="50" style="width:300px;" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="relname">
        <el-input size="small" v-model="form.relname" maxlength="50" style="width:300px;" placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="企业" prop="coId">
        <el-select size="small" style="width:300px;" v-model="form.coId" filterable placeholder="--请选择--">
          <el-option v-for="item in entList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="active">
        <el-select size="small" style="width:300px;" v-model="form.active" placeholder="--请选择--">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="padding: 0px 80px;color: #f00;">初始密码为“123”</div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handle_Close">取消</el-button>
      <el-button type="primary">确认</el-button>
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
        active: "",
        coId: "",
        role: 2
      },
      rules: {}
    };
  },
  methods: {
    handle_Close() {
      this.$refs["form"].resetFields();
      this.$emit("dialogHandle", { dialog: false, isreload: false });
    }
  },
  watch: {
    formDialog() {
      if (this.formDialog) {
        this.http.get("/api/ent/select").then(res => {
          if (res.code == 200) {
            this.entList = res.data;
          }
          if (this.id == 0) {
            this.form = {
              id: 0,
              username: "",
              relname: "",
              active: "",
              coId: "",
              role: 2
            };
          } else {
            this.http.get("/api/user/" + this.id).then(res => {});
          }
        });
      }
    }
  }
};
</script>

<style>
</style>
