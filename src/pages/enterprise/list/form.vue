<template>
  <el-dialog title="企业信息表单" :visible.sync="formDialog" top="10vh" width="700px" append-to-body :close-on-click-modal="false" :before-close="handle_Close">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="企业名称">
        <el-input style="width:350px;" placeholder="请输入企业名称"></el-input>
      </el-form-item>
      <el-form-item label="封面图">
        <el-upload style="float:left;" class="avatar-uploader" action="/api/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <form-img v-if="form.picture" :img="form.picture"></form-img>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handle_Close">取消</el-button>
      <el-button type="primary">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
var loadding = null;
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
      form: {
        id: 0,
        name: "",
        abstract: "",
        cover: "",
        imgList: ""
      }
    };
  },
  methods: {
    handle_Close() {
      this.$refs["form"].resetFields();
      this.$emit("dialogHandle", { dialog: false, isreload: false });
    },
    handleAvatarSuccess(res, file) {
      /* if (res.code == 200) {
        this.form.picture = res.data[0];
      } else this.$message.error(res.msg);
      loadding.close(); */
    },
    beforeAvatarUpload(file) {
      const isJPG = "image/jpeg,image/png".indexOf(file.type) > -1;

      if (!isJPG) {
        this.$message.error("上传的图片只能是jpg,png格式！");
        return isJPG;
      }
      loadding = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      return isJPG;
    }
  }
};
</script>

<style scoped>
.form-tuo {
  display: inline-block;
}
</style>
