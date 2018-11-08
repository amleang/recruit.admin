<template>
    <el-dialog title="纠错详情" :visible.sync="formDialog" top="20vh" width="800px" :modal-append-to-body="false" :close-on-click-modal="false" :before-close="handleClose">
        <el-card>
            <el-form label-width="180px" ref="form">
                <el-form-item label="纠错内容">
                    <el-input type="textarea" :rows="3" placeholder="请输入内容" disabled v-model="form.content">
                    </el-input>
                </el-form-item>
                <el-form-item label="纠错图片" v-if="form.imgs.length>0">
                    <div class="avatar-uploader" v-for="(item,index) in form.imgs" :key="index">
                        <div class="el-upload el-upload--text">
                            <img :src="item" alt="" class="avatar">
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </el-card>
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
      form: {
        id: "",
        content: "",
        imgs: []
      }
    };
  },
  methods: {
    handleClose() {
      this.$refs["form"].resetFields();
      this.$emit("dialogHandle", { dialog: false, isreload: false });
    }
  },
  watch: {
    formDialog() {
      if (this.formDialog) {
        this.http.get("/api/correction/" + this.id).then(res => {
          if (res.code == 200) {
            this.form = res.data;
          }
        });
      } else {
        this.form = {
          id: "",
          content: "",
          imgs: []
        };
      }
    }
  }
};
</script>

<style>
</style>
