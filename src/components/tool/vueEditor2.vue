<template>
  <div>
    <div class="vue-edit">
      <vue-editor style="line-height: 0px !important;" ref="vueeditor" :editorOptions="editorSettings" v-model="content"></vue-editor>
      <el-upload v-show="false" class="avatar-uploader" id="quill-upload" multiple accept="image/*" action="/api/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      </el-upload>
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
  [{ color: [] }, { background: [] }],
  [
    { align: "" },
    { align: "right" },
    { align: "center" },
    { align: "justify" }
  ],
  ["image"]
];
var loadding = null;
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
  mounted() {
    this.content = this.edit;
  },

  data() {
    return {
      content: "",
      editorSettings: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏}
            handlers: {
              image: function(value) {
                debugger;
                console.log("ele");
                if (value) {
                  document.querySelector("#quill-upload input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      }
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = "image/jpeg,image/png,image/gif".indexOf(file.type) > -1;
      if (!isJPG) {
        this.$message.error("Upload image can only be JPG format！");
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
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        debugger;
        let quill = this.$refs.vueeditor.quill;
        let length = quill.getSelection().index;
        quill.insertEmbed(length, "image", "http://www.szdejurenhe.com" + res.data);
        // 调整光标到最后
        quill.setSelection(length + 1);
        //this.$emit("changeedit", this.content);
      } else this.$message.error(res.msg);
      loadding.close();
    }
  },
  watch: {
    content() {
      this.$emit("changeedit", this.content);
    },
    edit() {
      this.content = this.edit;
    }
  }
};
</script>

<style>
.vue-edit .ql-snow .ql-picker-options .ql-picker-item {
  line-height: 15px;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: normal;
}
.ql-editor {
  font-size: 14px !important;
}
</style>
