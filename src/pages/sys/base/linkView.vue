<template>
  <div>
    <el-form :inline="true" ref="linkform" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="联系人" prop="link">
        <el-input v-model="form.link" size="small" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系人电话" prop="phone">
        <el-input v-model="form.phone" size="small" placeholder="请输入联系人电话"></el-input>
      </el-form-item>
      <el-form-item label="是否主联系人">
        <el-switch v-model="form.default" @change="change_handle"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: function() {
        return { link: "", phone, default: false };
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      rules: {}
    };
  },
  methods: {
    change_handle(val) {
      if (val) {
        this.$emit("linkChange", this.index);
      }
    },
    validateFun() {
      this.$refs.linkform.validate(valid => {
        return valid;
      });
    }
  }
};
</script>

<style>
</style>
