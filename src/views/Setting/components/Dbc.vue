<template>
  <el-card>
    <el-form :model="config" label-width="160px" style="width: 50%">
      <el-form-item label="dbc 文件路径">
        <el-input v-model="config.path">
          <el-button slot="append" @click="selectPath">选择路径</el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="store">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState("global", { config: "dbcConfig" })
  },
  methods: {
    ...mapActions("global", ["storeDbcConfig"]),
    selectPath() {
      const { ipcRenderer } = window.require("electron");

      ipcRenderer.send("SELECT_DBC_PATH");
      ipcRenderer.on("SELECT_DBC_PATH_REPLY", (event, path) => {
        this.config.path = path;
      });
    },
    store() {
      if (this.config.path === "") {
        this.$notify({
          type: "error",
          title: "失败",
          message: "dbc 文件路径不能为空。"
        });
      } else {
        this.storeDbcConfig(this.config);
        this.$notify({
          type: "success",
          title: "成功",
          message: "修改设置成功，请按F5或者Ctrl+R重新加载程序。"
        });
      }
    }
  }
};
</script>
