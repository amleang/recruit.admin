<template>
    <el-dialog title="招工表单" :visible.sync="formDialog" top="20vh" width="1000px" :modal-append-to-body="false" :fullscreen="true" :close-on-click-modal="false" :before-close="handleClose">
        <el-card>
            <el-form label-width="180px" ref="form">
                <el-form-item label="标题">
                    <el-input v-model="form.name" size="small" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="副标题">
                    <el-input v-model="form.subname" size="small" maxlength="50"></el-input>
                </el-form-item>

                <el-form-item label="补贴">
                    <div v-for="(item,index) in form.subsidys" :key="index" class="subsidy-item">
                        <div>
                            <vue-editor :edit="item.value" @changeedit="content=>item.value = content"></vue-editor>
                        </div>
                        <div class="subsidy-close" @click="subsidy_close(index)"><i class="el-dialog__close el-icon el-icon-close"></i></div>
                    </div>
                    <el-button type="success" size="small" @click="add_subsidys">添加补贴</el-button>
                </el-form-item>
                <el-form-item label="工资福利">
                    <vue-editor :edit="form.wages" @changeedit="content=>form.wages = content"></vue-editor>
                </el-form-item>
                <el-form-item label="岗位介绍">
                    <vue-editor :edit="form.post" @changeedit="content=>form.post = content"></vue-editor>
                </el-form-item>
                <el-form-item label="企业介绍">
                    <vue-editor :edit="form.introduce" @changeedit="content=>form.introduce = content"></vue-editor>
                </el-form-item>
            </el-form>
        </el-card>
        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="confirm_handle">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
import VueEditor from "@/components/tool/vueEditor";
export default {
  components: {
    VueEditor
  },
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
      form: {
        id: 0,
        name: "",
        subsidys: [{ value: "" }],
        wages: "",
        post: "",
        introduce: ""
      }
    };
  },
  methods: {
    handleClose() {
      this.$refs["form"].resetFields();
      this.$emit("dialogHandle", { dialog: false, isreload: false });
    },
    add_subsidys() {
      this.form.subsidys.push({ value: "" });
    },
    subsidy_close(index) {
      if (this.form.subsidys.length == 1) return;
      this.form.subsidys.splice(index, 1);
    },
    confirm_handle() {}
  }
};
</script>

<style scoped>
.subsidy-item {
  margin-bottom: 10px;
  position: relative;
}
.subsidy-close {
  position: absolute;
  right: 14px;
  top: 4px;
  font-size: 20px;
  cursor: pointer;
}
.subsidy-close:hover {
  color: #f00;
}
</style>
