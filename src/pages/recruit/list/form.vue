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
        <el-form-item label="图片">
          <el-upload v-for="(item,index) in form.imgs" :key="index" class="avatar-uploader" action="/api/upload" :show-file-list="false" :on-success="(res, file)=>handleAvatarSuccess(res, file,index)" :before-upload="beforeAvatarUpload">
            <form-img :img="item"></form-img>
            <i class="imgs-del el-icon el-icon-delete" @click.stop="img_del_handle(index)"></i>
          </el-upload>
          <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false" :on-success="(res, file)=>handleAvatarSuccess(res, file,0)" :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="薪资范围">
          <el-col :span="4" style="min-width:190px;">
            <el-input-number v-model="form.salaryStart" :min="1" :max="100000" label="起始薪资"></el-input-number>
          </el-col>
          <el-col style="text-align: center;" :span="1">-</el-col>
          <el-col :span="4" style="min-width:190px;">
            <el-input-number v-model="form.salaryEnd" :min="1" :max="100000" label="截止薪资"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="类型">
          <el-col :span="4" style="min-width:190px;padding-right: 10px;">
            <el-select size="small" v-model="form.type">
              <el-option label="无" :value="0"></el-option>
              <el-option label="工价" :value="1"></el-option>
              <el-option label="补贴" :value="2"></el-option>
            </el-select>
          </el-col>
          <el-col v-if="form.type==2" :span="6" style="min-width:190px;">
            <el-input v-model="form.subsidyExplain" size="small" maxlength="50" placeholder="补贴说明"></el-input>
          </el-col>
          <el-col v-if="form.type==1" :span="5">
            <el-input-number size="small" v-model="form.laborPrice" :min="1" :max="999"></el-input-number><span style="margin-left:8px;">元/小时</span>
          </el-col>
        </el-form-item>
        <el-form-item label="补贴">
          <div v-for="(item,index) in form.subsidys" :key="index" class="subsidy-item">
            <div>
              <vue-editor :edit="form.subsidys[index].value" @changeedit="content=>form.subsidys[index].value = content"></vue-editor>
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
var loadding = null;
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
        subname: "",
        salaryStart: "",
        salaryEnd: "",
        subsidys: [{ value: "" }],
        wages: "",
        post: "",
        introduce: "",
        imgs: [],
        type: 0,
        subsidyExplain: "",
        laborPrice: ""
      }
    };
  },
  methods: {
    handleAvatarSuccess(res, file, type) {
      if (res.code == 200) {
        if (type == 0) {
          this.form.imgs.push(res.data);
        } else this.form.imgs[type] = res.data;
      } else this.$message.error(res.msg);
      loadding.close();
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
    },
    img_del_handle(index) {
      this.form.imgs.splice(index, 1);
    },
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
    confirm_handle() {
      if (!this.form.name) {
        this.$message.warning("请输入标题");
        return;
      }
      if (!this.form.subname) {
        this.$message.warning("请输入副标题");
        return;
      }
      if (this.form.imgs.length == 0) {
        this.$message.warning("请上传图片");
        return;
      }
      if (this.form.salaryStart > this.form.salaryEnd) {
        this.$message.warning("起始工资不能大于截止工资");
        return;
      }
      if (this.form.type == 2 && !this.form.subsidyExplain) {
        this.$message.warning("请输入补贴说明");
        return;
      }
      var isFlag = true;
      this.form.subsidys.forEach(item => {
        if (item.value == "") isFlag = false;
      });
      if (!isFlag) {
        this.$message.warning("请完善补贴内容");
        return;
      }
      if (this.form.wages == "") {
        this.$message.warning("请完善工资福利内容");
        return;
      }
      if (this.form.post == "") {
        this.$message.warning("请完善岗位介绍内容");
        return;
      }
      if (this.form.introduce == "") {
        this.$message.warning("请完善企业介绍内容");
        return;
      }
      if (this.id == 0) {
        this.http.post("/api/recruit", this.form).then(res => {
          if (res.code == 200) {
            this.$emit("dialogHandle", { dialog: false, isreload: true });
            this.$message.success("添加成功!");
            this.$refs["form"].resetFields();
          } else this.$message.error(res.msg);
        });
      } else {
        this.http.put("/api/recruit", this.form).then(res => {
          if (res.code == 200) {
            this.$emit("dialogHandle", { dialog: false, isreload: true });
            this.$message.success("修改成功!");
            this.$refs["form"].resetFields();
          } else this.$message.error(res.msg);
        });
      }
    }
  },
  watch: {
    formDialog() {
      if (this.formDialog) {
        if (this.id == 0) {
          this.form = {
            id: 0,
            name: "",
            subname: "",
            salaryStart: "",
            salaryEnd: "",
            subsidys: [{ value: "" }],
            wages: "",
            post: "",
            introduce: "",
            imgs: [],
            type: 0,
            subsidyExplain: "",
            laborPrice: ""
          };
        } else {
          this.http.get("/api/recruit/" + this.id).then(res => {
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

<style scoped>
.avatar-uploader {
  margin-right: 10px;
  margin-top: 10px;
  float: left;
}
.avatar-uploader .imgs-del {
  position: absolute;
  color: #f00;
  font-size: 20px;
  cursor: pointer;
}
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
