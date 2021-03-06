const ipcRenderer = window.require("electron").ipcRenderer;

import {
  INIT_MYSQL_CONNECTION,
  SET_ACTIVE,
  STORE_MYSQL_CONFIG,
  STORE_DBC_CONFIG,
  STORE_CONFIG_CONFIG,
  STORE_DEVELOPER_CONFIG,
  TEST_MYSQL_CONNECTION,
  INIT_DBC_CONFIG,
} from "../constants";

export default {
  namespaced: true,
  state: () => ({
    debug: false,
    active: "dashboard",
    mysqlConfig: {
      host: "127.0.0.1",
      user: "root",
      password: "password",
      database: "acore_world",
    },
    dbcConfig: {
      path: "",
    },
    configConfig: {
      path: "",
    },
    developerConfig: {
      debug: false,
    },
  }),
  actions: {
    setActive({ commit }, payload) {
      return new Promise((resolve) => {
        commit(SET_ACTIVE, payload);
        resolve();
      });
    },
    storeDeveloperConfig({ commit }, payload) {
      return new Promise((resolve) => {
        localStorage.setItem("debug", payload.debug);
        commit(STORE_DEVELOPER_CONFIG, payload);
        resolve();
      });
    },
    storeMysqlConfig({ commit }, payload) {
      return new Promise((resolve) => {
        localStorage.setItem("host", payload.host);
        localStorage.setItem("user", payload.user);
        localStorage.setItem("password", payload.password);
        localStorage.setItem("database", payload.database);
        commit(STORE_MYSQL_CONFIG, payload);
        resolve();
      });
    },
    storeDbcConfig({ commit }, payload) {
      return new Promise((resolve) => {
        localStorage.setItem("dbcPath", payload.path);
        commit(STORE_DBC_CONFIG, payload);
        resolve();
      });
    },
    storeConfigConfig({ commit }, payload) {
      return new Promise((resolve) => {
        localStorage.setItem("configPath", payload.path);
        commit(STORE_CONFIG_CONFIG, payload);
        resolve();
      });
    },
    initMysqlConnection(context, payload) {
      return new Promise((resolve, reject) => {
        ipcRenderer.send(INIT_MYSQL_CONNECTION, payload);
        ipcRenderer.on(INIT_MYSQL_CONNECTION, () => {
          resolve();
        });
        ipcRenderer.on(`${INIT_MYSQL_CONNECTION}_REJECT`, (event, error) => {
          reject(error);
        });
      });
    },
    initDbcConnection(context, payload) {
      return new Promise((resolve, reject) => {
        ipcRenderer.send(INIT_DBC_CONFIG, payload);
        ipcRenderer.on(INIT_DBC_CONFIG, () => {
          resolve();
        });
        ipcRenderer.on(`${INIT_DBC_CONFIG}_REJECT`, (event, error) => {
          reject(error);
        });
      });
    },
    testMysqlConfig(context, payload) {
      return new Promise((resolve, reject) => {
        ipcRenderer.send(TEST_MYSQL_CONNECTION, payload);
        ipcRenderer.on(TEST_MYSQL_CONNECTION, (event, response) => {
          resolve(response);
        });
        ipcRenderer.on(`${TEST_MYSQL_CONNECTION}_REJECT`, (event, error) => {
          reject(error);
        });
      });
    },
  },
  mutations: {
    [SET_ACTIVE](state, active) {
      state.active = active;
    },
    [STORE_DEVELOPER_CONFIG](state, config) {
      state.developerConfig = config;
    },
    [STORE_CONFIG_CONFIG](state, config) {
      state.configConfig = config;
    },
    [STORE_DBC_CONFIG](state, config) {
      state.dbcConfig = config;
    },
    [STORE_MYSQL_CONFIG](state, config) {
      state.mysqlConfig = config;
    },
  },
};
