const ipcRenderer = window.require("electron").ipcRenderer;

import {
  SEARCH_CREATURE_QUEST_ENDERS,
  STORE_CREATURE_QUEST_ENDER,
  FIND_CREATURE_QUEST_ENDER,
  UPDATE_CREATURE_QUEST_ENDER,
  DESTROY_CREATURE_QUEST_ENDER,
  CREATE_CREATURE_QUEST_ENDER,
  COPY_CREATURE_QUEST_ENDER,
} from "../constants";

export default {
  namespaced: true,
  state: () => ({
    creatureQuestEnders: [],
    creatureQuestEnder: {},
  }),
  actions: {
    searchCreatureQuestEnders({ commit }, payload) {
      return new Promise((resolve) => {
        ipcRenderer.send(SEARCH_CREATURE_QUEST_ENDERS, payload);
        ipcRenderer.on(SEARCH_CREATURE_QUEST_ENDERS, (event, response) => {
          commit(SEARCH_CREATURE_QUEST_ENDERS, response);
          resolve();
        });
      });
    },
    storeCreatureQuestEnder(context, payload) {
      return new Promise((resolve) => {
        ipcRenderer.send(STORE_CREATURE_QUEST_ENDER, payload);
        ipcRenderer.on(STORE_CREATURE_QUEST_ENDER, () => {
          resolve();
        });
      });
    },
    findCreatureQuestEnder({ commit }, payload) {
      return new Promise((resolve) => {
        ipcRenderer.send(FIND_CREATURE_QUEST_ENDER, payload);
        ipcRenderer.on(FIND_CREATURE_QUEST_ENDER, (event, response) => {
          commit(FIND_CREATURE_QUEST_ENDER, response);
          resolve();
        });
      });
    },
    updateCreatureQuestEnder(context, payload) {
      return new Promise((resolve) => {
        ipcRenderer.send(UPDATE_CREATURE_QUEST_ENDER, payload);
        ipcRenderer.on(UPDATE_CREATURE_QUEST_ENDER, () => {
          resolve();
        });
      });
    },
    destroyCreatureQuestEnder(context, payload) {
      return new Promise((resolve) => {
        ipcRenderer.send(DESTROY_CREATURE_QUEST_ENDER, payload);
        ipcRenderer.on(DESTROY_CREATURE_QUEST_ENDER, () => {
          resolve();
        });
      });
    },
    createCreatureQuestEnder({ commit }, payload) {
      return new Promise((resolve) => {
        commit(CREATE_CREATURE_QUEST_ENDER, payload);
        resolve();
      });
    },
    copyCreatureQuestEnder(context, payload) {
      return new Promise((resolve) => {
        ipcRenderer.send(COPY_CREATURE_QUEST_ENDER, payload);
        ipcRenderer.on(COPY_CREATURE_QUEST_ENDER, () => {
          resolve();
        });
      });
    },
  },
  mutations: {
    [SEARCH_CREATURE_QUEST_ENDERS](state, creatureQuestEnders) {
      state.creatureQuestEnders = creatureQuestEnders;
    },
    [FIND_CREATURE_QUEST_ENDER](state, creatureQuestEnder) {
      state.creatureQuestEnder = creatureQuestEnder;
    },
    [CREATE_CREATURE_QUEST_ENDER](state, creatureQuestEnder) {
      state.creatureQuestEnder = creatureQuestEnder;
    },
  },
};
