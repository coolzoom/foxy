<template>
  <div>
    <div v-show="!creating">
      <el-card style="margin-top: 16px">
        <el-button type="primary" @click="create">新增</el-button>
        <el-button @click="copy" :disabled="disabled">复制</el-button>
        <el-button type="danger" @click="destroy" :disabled="disabled">
          删除
        </el-button>
      </el-card>
      <el-card style="margin-top: 16px">
        <el-table
          :data="skinningLootTemplates"
          highlight-current-row
          @current-change="select"
          @row-dblclick="show"
        >
          <el-table-column prop="displayid"></el-table-column>
          <el-table-column label="名称" sortable>
            <span slot-scope="scope">
              <template v-if="scope.row.Reference == 0">
                <template v-if="scope.row.localeName !== null">
                  {{ scope.row.localeName }}
                </template>
                <template v-else>{{ scope.row.name }}</template>
              </template>
              <template v-else>
                <el-tag>关联掉落</el-tag>
              </template>
            </span>
          </el-table-column>
          <el-table-column
            prop="Reference"
            label="关联"
            sortable
          ></el-table-column>
          <el-table-column prop="Chance" label="几率" sortable>
            <span slot-scope="scope">
              {{ `${scope.row.Chance}%` }}
            </span>
          </el-table-column>
          <el-table-column prop="QuestRequired" label="需要任务" sortable>
            <span slot-scope="scope">
              <el-tag type="success" v-if="scope.row.QuestRequired">
                需要
              </el-tag>
              <el-tag v-else>不需要</el-tag>
            </span>
          </el-table-column>
          <el-table-column
            prop="MinCount"
            label="最小数量"
            sortable
          ></el-table-column>
          <el-table-column
            prop="MaxCount"
            label="最大数量"
            sortable
          ></el-table-column>
        </el-table>
      </el-card>
    </div>
    <div v-show="creating">
      <el-form
        :model="skinningLootTemplate"
        label-position="right"
        label-width="120px"
      >
        <el-card style="margin-top: 16px">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="编号">
                <el-input-number
                  v-model="skinningLootTemplate.Entry"
                  controls-position="right"
                  v-loading="initing"
                  placeholder="Entry"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(255, 255, 255, 0.5)"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="物品">
                <el-input-number
                  v-model="skinningLootTemplate.Item"
                  controls-position="right"
                  v-loading="initing"
                  placeholder="Item"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(255, 255, 255, 0.5)"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="关联">
                <el-input-number
                  v-model="skinningLootTemplate.Reference"
                  controls-position="right"
                  placeholder="Reference"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="几率">
                <el-input-number
                  v-model="skinningLootTemplate.Chance"
                  controls-position="right"
                  placeholder="Chance"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="需要任务">
                <el-switch
                  v-model="skinningLootTemplate.QuestRequired"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="掉落模式">
                <el-input-number
                  v-model="skinningLootTemplate.LootMode"
                  controls-position="right"
                  placeholder="LootMode"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="组ID">
                <el-input-number
                  v-model="skinningLootTemplate.GroudId"
                  controls-position="right"
                  placeholder="GroudId"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="最小数量">
                <el-input-number
                  v-model="skinningLootTemplate.MinCount"
                  controls-position="right"
                  placeholder="MinCount"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="最大数量">
                <el-input-number
                  v-model="skinningLootTemplate.MaxCount"
                  controls-position="right"
                  placeholder="MaxCount"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="注解">
                <el-input
                  v-model="skinningLootTemplate.Comment"
                  placeholder="Comment"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-top: 16px">
          <el-button type="primary" :loading="loading" @click="store"
            >保存</el-button
          >
          <el-button @click="cancel">返回</el-button>
        </el-card>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      initing: false,
      creating: false,
      editing: false,
      currentRow: undefined,
      loading: false
    };
  },
  computed: {
    ...mapState("creatureTemplate", ["creatureTemplate"]),
    ...mapState("skinningLootTemplate", [
      "skinningLootTemplates",
      "skinningLootTemplate"
    ]),
    disabled() {
      return this.currentRow == undefined;
    },
    credential() {
      return {
        Entry: this.currentRow != undefined ? this.currentRow.Entry : undefined,
        Item: this.currentRow != undefined ? this.currentRow.Item : undefined
      };
    }
  },
  methods: {
    ...mapActions("skinningLootTemplate", [
      "searchSkinningLootTemplates",
      "storeSkinningLootTemplate",
      "findSkinningLootTemplate",
      "updateSkinningLootTemplate",
      "destroySkinningLootTemplate",
      "createSkinningLootTemplate",
      "copySkinningLootTemplate"
    ]),
    async create() {
      this.creating = true;
      this.editing = false;
      await this.createSkinningLootTemplate({
        Entry: this.creatureTemplate.skinloot
      });
    },
    async store() {
      if (!this.editing) {
        await this.storeSkinningLootTemplate(this.skinningLootTemplate);
      } else {
        await this.updateSkinningLootTemplate({
          credential: this.credential,
          skinningLootTemplate: this.skinningLootTemplate
        });
      }
      await this.searchSkinningLootTemplates({
        Entry: this.creatureTemplate.skinloot
      });
      this.creating = false;
      this.editing = false;
    },
    cancel() {
      this.creating = false;
    },
    copy() {
      this.$confirm("此操作不会复制关联表数据，确认继续？</small>", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
        dangerouslyUseHTMLString: true,
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            this.copySkinningLootTemplate(this.credential)
              .then(() => {
                this.searchSkinningLootTemplates({
                  Entry: this.creatureTemplate.skinloot
                });
              })
              .then(() => {
                instance.confirmButtonLoading = false;
                done();
              });
          } else {
            done();
          }
        }
      });
    },
    destroy() {
      this.$confirm(
        "此操作将永久删除该数据，确认继续？<br><small>为避免误操作，不提供删除关联表数据功能。</small>",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
          dangerouslyUseHTMLString: true,
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              this.destroySkinningLootTemplate(this.credential)
                .then(() => {
                  this.searchSkinningLootTemplates({
                    Entry: this.creatureTemplate.skinloot
                  });
                })
                .then(() => {
                  instance.confirmButtonLoading = false;
                  done();
                });
            } else {
              done();
            }
          }
        }
      );
    },
    select(row) {
      this.currentRow = row;
    },
    async show(row) {
      this.creating = true;
      this.editing = true;
      await this.findSkinningLootTemplate({
        Entry: row.Entry,
        Item: row.Item
      });
    },
    async init() {
      this.initing = true;
      await this.searchSkinningLootTemplates({
        Entry: this.creatureTemplate.skinloot
      });
      this.initing = false;
    }
  },
  mounted() {
    this.init();
  }
};
</script>
