<template>
  <div>
    <div class="vue-edit">
      <vue-editor style="line-height: 0px !important;" ref="vueeditor" :editorOptions="editorSettings" v-model="content"></vue-editor>
    </div>
  </div>
</template>

<script>
import { VueEditor, Quill } from "vue2-editor";
const toolbarOptions = [
  [
    "bold",
    "italic",
    "underline",
    "strike",
    "link",
    { header: [1, 2, 3, 4, 5, 6, false] }
  ],

  [{ list: "ordered" }, { list: "bullet" }],
  // [{ 'script': 'sub'}, { 'script': 'super' }],
  // [{ 'indent': '-1'}, { 'indent': '+1' }],
  // [{ 'direction': 'rtl' }],
  [{ color: [] }, { background: [] }],
  [
    { align: "" },
    { align: "right" },
    { align: "center" },
    { align: "justify" }
  ],

];
export default {
  props: {
    edit: {
      type: String,
      default: ""
    },
    height: {
      type: Number,
      default: 0
    }
  },
  components: {
    VueEditor
  },
  data() {
    return {
      content: "",
      editorSettings: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions // 工具栏}
          }
        }
      }
    };
  },
  watch: {
    edit() {
      this.content = this.edit;
    }
  }
};
</script>

<style>
.vue-edit .ql-snow .ql-picker-options .ql-picker-item{
  line-height: 15px;
}
</style>
