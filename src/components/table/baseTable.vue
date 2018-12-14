<template>
  <div>
    <el-card class="box-card table-form" :style="`min-width:${minwidth}px;`">
      <div slot="header">
        <span>{{tableName}}</span>
        <div style="float: right;margin-top: -5px;">
          <slot name="button">

          </slot>
        </div>
      </div>
      <el-table ref="table" :data="tableData" :style=" `width: 100%;margin-top:-8px; height:${tableHeight}px;`" @selection-change="handleSelectionChange">
        <el-table-column v-if="isExpand" type="expand">
          <template slot-scope="scope">
            <slot name="expand" :row="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column v-if="selection" type="selection" width="55"></el-table-column>

        <el-table-column v-if="isAdd">
          <template slot-scope="scope">
            <el-button size="small" icon="el-icon-plus" type="success" v-if="scope.row.isAdd" @click="add_handle(scope)">
              <!-- Add -->添加</el-button>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in columns" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
          <template slot-scope="scope">
            <div v-if="item.type=='data'">
              {{scope.row[item.prop] }}
            </div>
            <div v-if="item.type=='comps'">
              <slot :row="scope.row" :tplName="item.tplName" :index="scope.$index" :val="scope.row[item.prop]"></slot>
            </div>
            <div v-if="item.type=='time'">
              {{formatDate(scope.row[item.prop])}}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="paging" style="margin-top:20px;text-align:center;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40,50]" :current-page="currPage" :page-size="pageSize" :layout="paginationlayout" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { formatDate } from "@/components/lib/util";
export default {
  props: {
    isExpand: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: false
    },
    addList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    selection: {
      type: Boolean,
      default: false
    },
    paging: {
      type: Boolean,
      default: true
    },
    action: {
      type: String,
      default: ""
    },
    tableName: {
      type: String,
      default: ""
    },
    queryParams: {
      type: Object,
      default: function() {
        return {};
      }
    },
    topHeight: {
      type: Number,
      default: 400
    },
    minwidth: {
      type: Number,
      default: 700
    },
    paginationlayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    /**数据列 */
    columns: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  mounted() {
    console.log("isExpand=>", this.isExpand);
    this.tableHeight =
      document.documentElement.clientHeight - this.topHeight - 120;
    if (this.action) this.reload();
  },
  data() {
    return {
      tableHeight: 500,
      currPage: 1,
      pageSize: 10,
      total: 20,
      tableData: [],
      multipleSelection: []
    };
  },
  methods: {
    formatDate,
    load_handle() {
      this.multipleSelection = [];
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.queryParams.page = this.currPage;
      this.queryParams.size = this.pageSize;
      const that = this;
      this.http.get(this.action, { params: this.queryParams }).then(res => {
        if (res.code == 200) {
          if (this.paging) {
            this.total = res.count;
            this.tableData = res.data || [];
            if (res.count > 0) {
              setTimeout(() => {
                this.$emit("loadrowhandle", this.tableData);
              }, 1);
            }
          } else {
            this.tableData = res.data || [];
          }
          if (that.isAdd) {
            that.tableData.forEach(item => {
              var flist = that.addList.filter(x => x.id == item.id);
              if (flist.length > 0) item.isAdd = false;
              else item.isAdd = true;
            });
          }
        } else this.$message.error(res.msg);
        setTimeout(() => {
          loading.close();
        }, 1000);
      });
    },
    reload() {
      this.currPage = 1;
      this.load_handle(this.queryParams);
    },
    /**分页条数变更 */
    handleSizeChange(e) {
      this.pageSize = e;
      this.load_handle(this.queryParams);
    },
    /**当前页变更 */
    handleCurrentChange(e) {
      this.currPage = e;
      this.load_handle(this.queryParams);
    },
    add_handle(scope) {
      this.tableData[scope.$index].isAdd = false;
      this.addList.push(scope.row);
      console.log("scope=>", scope);
      this.$emit("addHandle", this.addList);
    },
    handleSelectionChange(val) {
      console.log("val=>", val);
      if (val.length > 0) {
        val.forEach(item => {
          var flist = this.multipleSelection.filter(x => x.id == item.id);
          if (flist.length == 0) this.multipleSelection.push(item);
        });
      }
      var noList = [];
      this.tableData.forEach(item => {
        var flist = val.filter(x => x.id == item.id);
        if (flist.length == 0) noList.push(item);
      });
      noList.forEach(item => {
        var isFlag = false;
        var index = 0;
        this.multipleSelection.forEach((x, idx) => {
          if (item.id == x.id) {
            isFlag = true;
            index = idx;
          }
        });
        if (isFlag) this.multipleSelection.splice(index, 1);
      });
      console.log("multipleSelection=>", this.multipleSelection);
    }
  }
};
</script>

<style>
</style>
