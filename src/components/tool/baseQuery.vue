<template>
    <el-card class="box-card search-form" style="`min-width:700px;margin-bottom:20px;">
        <div slot="header" class="clearfix">
            <div style="float:left; height:32px;line-height:32px;">
              <!-- Query -->查询
            </div>
            <div style="float: right;">
                <el-button type="primary" size="small" class="btn-box-shadow" icon="el-icon-search" @click="query_handle">
                  <!-- Query -->查询
                </el-button>
            </div>
        </div>
        <div>
            <slot></slot>
        </div>
    </el-card>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    query_handle() {
      this.$emit("queryhandle");
    }
  }
};
</script>

<style>
</style>
