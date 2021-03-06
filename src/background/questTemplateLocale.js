import { ipcMain } from "electron";

import {
  SEARCH_QUEST_TEMPLATE_LOCALES,
  STORE_QUEST_TEMPLATE_LOCALES,
  GLOBAL_NOTICE,
} from "../constants";

const { knex } = require("../libs/mysql");

ipcMain.on(SEARCH_QUEST_TEMPLATE_LOCALES, (event, payload) => {
  let queryBuilder = knex()
    .select()
    .from("quest_template_locale")
    .where(payload);

  queryBuilder
    .then((rows) => {
      event.reply(SEARCH_QUEST_TEMPLATE_LOCALES, rows);
    })
    .catch((error) => {
      event.reply(`${SEARCH_QUEST_TEMPLATE_LOCALES}_REJECT`, error);
    })
    .finally(() => {
      event.reply(GLOBAL_NOTICE, {
        category: "message",
        message: queryBuilder.toString(),
      });
    });
});

ipcMain.on(STORE_QUEST_TEMPLATE_LOCALES, (event, payload) => {
  let deleteQueryBuilder = knex()
    .table("quest_template_locale")
    .where("ID", payload[0].ID)
    .delete();
  let insertQueryBuilder = knex()
    .insert(payload)
    .into("quest_template_locale");

  deleteQueryBuilder
    .then((rows) => {
      insertQueryBuilder
        .then((rows) => {
          event.reply(STORE_QUEST_TEMPLATE_LOCALES, rows);
          event.reply(GLOBAL_NOTICE, {
            type: "success",
            category: "notification",
            title: "成功",
            message: `保存成功。`,
          });
        })
        .catch((error) => {
          event.reply(`${STORE_QUEST_TEMPLATE_LOCALES}_REJECT`, error);
        })
        .finally(() => {
          event.reply(GLOBAL_NOTICE, {
            category: "message",
            message: insertQueryBuilder.toString(),
          });
        });
    })
    .catch((error) => {
      event.reply(`${STORE_QUEST_TEMPLATE_LOCALES}_REJECT`, error);
    });
});
