const ipcRenderer = window.require("electron").ipcRenderer;

import {
  SEARCH_PROSPECTING_LOOT_TEMPLATES,
  STORE_PROSPECTING_LOOT_TEMPLATE,
  FIND_PROSPECTING_LOOT_TEMPLATE,
  UPDATE_PROSPECTING_LOOT_TEMPLATE,
  DESTROY_PROSPECTING_LOOT_TEMPLATE,
  CREATE_PROSPECTING_LOOT_TEMPLATE,
  COPY_PROSPECTING_LOOT_TEMPLATE,
} from "../constants";

export default {
  namespaced: true,
  state: () => ({
    prospectingLootTemplates: [],
    prospectingLootTemplate: {},
  }),
  actions: {
    searchProspectingLootTemplates({ commit }, payload) {
      return new Promise((resolve, reject) => {
        ipcRenderer.send(SEARCH_PROSPECTING_LOOT_TEMPLATES, payload);
        ipcRenderer.on(SEARCH_PROSPECTING_LOOT_TEMPLATES, (event, response) => {
          commit(SEARCH_PROSPECTING_LOOT_TEMPLATES, response);
          resolve();
        });
        ipcRenderer.on(
          `${SEARCH_PROSPECTING_LOOT_TEMPLATES}_REJECT`,
          (event, error) => {
            reject(error);
          }
        );
      });
    },
    storeProspectingLootTemplate(context, payload) {
      return new Promise((resolve, reject) => {
        ipcRenderer.send(STORE_PROSPECTING_LOOT_TEMPLATE, payload);
        ipcRenderer.on(STORE_PROSPECTING_LOOT_TEMPLATE, () => {
          resolve();
        });
        ipcRenderer.on(
          `${STORE_PROSPECTING_LOOT_TEMPLATE}_REJECT`,
          (event, error) => {
            reject(error);
          }
        );
      });
    },
    findProspectingLootTemplate({ commit }, payload) {
      return new Promise((resolve, reject) => {
        ipcRenderer.send(FIND_PROSPECTING_LOOT_TEMPLATE, payload);
        ipcRenderer.on(FIND_PROSPECTING_LOOT_TEMPLATE, (event, response) => {
          commit(FIND_PROSPECTING_LOOT_TEMPLATE, response);
          resolve();
        });
        ipcRenderer.on(
          `${FIND_PROSPECTING_LOOT_TEMPLATE}_REJECT`,
          (event, error) => {
            reject(error);
          }
        );
      });
    },
    updateProspectingLootTemplate(context, payload) {
      return new Promise((resolve, reject) => {
        ipcRenderer.send(UPDATE_PROSPECTING_LOOT_TEMPLATE, payload);
        ipcRenderer.on(UPDATE_PROSPECTING_LOOT_TEMPLATE, () => {
          resolve();
        });
        ipcRenderer.on(
          `${UPDATE_PROSPECTING_LOOT_TEMPLATE}_REJECT`,
          (event, error) => {
            reject(error);
          }
        );
      });
    },
    destroyProspectingLootTemplate(context, payload) {
      return new Promise((resolve, reject) => {
        ipcRenderer.send(DESTROY_PROSPECTING_LOOT_TEMPLATE, payload);
        ipcRenderer.on(DESTROY_PROSPECTING_LOOT_TEMPLATE, () => {
          resolve();
        });
        ipcRenderer.on(
          `${DESTROY_PROSPECTING_LOOT_TEMPLATE}_REJECT`,
          (event, error) => {
            reject(error);
          }
        );
      });
    },
    createProspectingLootTemplate({ commit }, payload) {
      return new Promise((resolve) => {
        commit(CREATE_PROSPECTING_LOOT_TEMPLATE, payload);
        resolve();
      });
    },
    copyProspectingLootTemplate(context, payload) {
      return new Promise((resolve, reject) => {
        ipcRenderer.send(COPY_PROSPECTING_LOOT_TEMPLATE, payload);
        ipcRenderer.on(COPY_PROSPECTING_LOOT_TEMPLATE, () => {
          resolve();
        });
        ipcRenderer.on(
          `${COPY_PROSPECTING_LOOT_TEMPLATE}_REJECT`,
          (event, error) => {
            reject(error);
          }
        );
      });
    },
  },
  mutations: {
    [SEARCH_PROSPECTING_LOOT_TEMPLATES](state, prospectingLootTemplates) {
      state.prospectingLootTemplates = prospectingLootTemplates;
    },
    [FIND_PROSPECTING_LOOT_TEMPLATE](state, prospectingLootTemplate) {
      state.prospectingLootTemplate = prospectingLootTemplate;
    },
    [CREATE_PROSPECTING_LOOT_TEMPLATE](state, prospectingLootTemplate) {
      state.prospectingLootTemplate = prospectingLootTemplate;
    },
  },
};
