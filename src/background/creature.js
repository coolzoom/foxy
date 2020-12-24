import { ipcMain } from "electron";
import {
  COPY_CREATURE_TEMPLATE,
  COUNT_CREATURE_TEMPLATES,
  DESTROY_CREATURE_TEMPLATE,
  FIND_CREATURE_TEMPLATE,
  GET_MAX_ENTRY_OF_CREATURE_TEMPLATE,
  GLOBAL_NOTICE,
  SEARCH_CREATURE_TEMPLATES,
  SEARCH_CREATURE_TEMPLATE_LOCALES,
  STORE_CREATURE_TEMPLATE,
  UPDATE_CREATURE_TEMPLATE
} from "../constants";

const mysql = require("mysql");
const connection = require("../libs/mysql");
const { objectToSql, payloadToInsertSql, payloadToUpdateSql } = require("../libs/util");

let find = payload => {
  return new Promise((resolve, reject) => {
    let sql = `select * from creature_template where entry=${payload.entry}`;

    connection.query(sql).then(results => {
      resolve({ creatureTemplate: results[0], sql });
    });
  });
};

let maxEntry = () => {
  return new Promise((resolve, reject) => {
    let sql = "select entry from creature_template order by entry desc";

    connection.query(sql).then(results => {
      resolve({ entry: results[0].entry, sql });
    });
  });
};

// 搜索满足条件的生物模板
ipcMain.on(SEARCH_CREATURE_TEMPLATES, (event, payload) => {
  let select =
    "select ct.entry, ct.name, ctl.Name as localeName, ct.subname, ctl.Title as localeTitle, ct.minlevel, ct.maxlevel from creature_template as ct left join creature_template_locale as ctl on ct.entry=ctl.entry and ctl.locale='zhCN'";

  let where = "";
  if (payload.entry) {
    where = `${where} and ct.entry like '%${payload.entry}%'`;
  }
  if (payload.name) {
    where = `${where} and (ct.name like '%${payload.name}%' or ctl.Name like '%${payload.name}%')`;
  }
  if (payload.subname) {
    where = `${where} and (ct.subname like '%${payload.subname}%' or ctl.Title like '%${payload.subname}%')`;
  }
  where = where.length >= 5 ? ` where ${where.substring(5)}` : " ";

  let page = payload.page;
  let offset = 0;
  if (page !== undefined) {
    offset = (page - 1) * 50;
  }
  let limit = `limit ${offset}, 50`;

  let sql = `${select}${where}${limit}`;

  connection.query(sql).then(results => {
    event.reply(SEARCH_CREATURE_TEMPLATES, results);
  });
});

// 计算满足条件的生物模板数量
ipcMain.on(COUNT_CREATURE_TEMPLATES, (event, payload) => {
  let select =
    "select count(*) as total from creature_template as ct left join creature_template_locale as ctl on ct.entry=ctl.entry and ctl.locale='zhCN'";

  let where = "";
  if (payload.entry) {
    where = `${where} and ct.entry like '%${payload.entry}%'`;
  }
  if (payload.name) {
    where = `${where} and (ct.name like '%${payload.name}%' or ctl.Name like '%${payload.name}%')`;
  }
  if (payload.subname) {
    where = `${where} and (ct.subname like '%${payload.subname}%' or ctl.Title like '%${payload.subname}%')`;
  }
  where = where.length >= 5 ? ` where ${where.substring(5)}` : " ";

  let sql = `${select}${where}`;

  connection.query(sql).then(results => {
    event.reply(COUNT_CREATURE_TEMPLATES, results[0].total);
  });
});

// 获得数据库中已保存生物模板的最大 entry
ipcMain.on(GET_MAX_ENTRY_OF_CREATURE_TEMPLATE, event => {
  maxEntry().then(({ entry }) => {
    event.reply(GET_MAX_ENTRY_OF_CREATURE_TEMPLATE, entry);
  });
});

// 保存生物模板
ipcMain.on(STORE_CREATURE_TEMPLATE, (event, payload) => {
  let sql = payloadToInsertSql("creature_template", payload);

  connection.query(sql).then(results => {
    event.reply(STORE_CREATURE_TEMPLATE, results);
    event.reply(GLOBAL_NOTICE, {
      category: "notification",
      title: "成功",
      message: "新建成功。",
      type: "success"
    });
  });
});

// 修改生物模板
ipcMain.on(UPDATE_CREATURE_TEMPLATE, (event, payload) => {
  let sql = payloadToUpdateSql("creature_template", payload, "entry");

  connection.query(sql).then(results => {
    event.reply(UPDATE_CREATURE_TEMPLATE, results);
    event.reply(GLOBAL_NOTICE, {
      category: "notification",
      title: "成功",
      message: "修改成功。",
      type: "success"
    });
  });
});

// 根据条件得到指定的生物模板
ipcMain.on(FIND_CREATURE_TEMPLATE, (event, payload) => {
  find(payload).then(({ creatureTemplate, sql }) => {
    event.reply(FIND_CREATURE_TEMPLATE, creatureTemplate);
  });
});

// 删除满足条件生物模板
ipcMain.on(DESTROY_CREATURE_TEMPLATE, (event, payload) => {
  let sql = `delete from creature_template where entry=${payload.entry}`;

  connection.query(`${sql}`).then(results => {
    event.reply(DESTROY_CREATURE_TEMPLATE, results);
    event.reply("GLOBAL_NOTICE", {
      category: "notification",
      title: "成功",
      message: "删除成功。",
      type: "success"
    });
  });
});

// 复制满足条件的生物模板
ipcMain.on(COPY_CREATURE_TEMPLATE, (event, payload) => {
  let newEntry = 1;
  let newCreatureTemplate = {};
  Promise.all([
    maxEntry().then(({ entry }) => {
      newEntry = entry + 1;
    }),
    find(payload).then(({ creatureTemplate }) => {
      newCreatureTemplate = creatureTemplate;
    })
  ]).then(() => {
    newCreatureTemplate.entry = newEntry;
    let sql = payloadToInsertSql("creature_template", newCreatureTemplate);

    connection.query(sql).then(results => {
      event.reply(COPY_CREATURE_TEMPLATE, results);
      event.reply(GLOBAL_NOTICE, {
        type: "success",
        category: "notification",
        title: "成功",
        message: `复制成功，新的生物模板 entry 为 ${newEntry}`
      });
    });
  });
});

// 搜索满足条件的本地化生物模板
ipcMain.on(SEARCH_CREATURE_TEMPLATE_LOCALES, (event, payload) => {
  let sql = `select * from creature_template_locale where entry=${payload.entry}`;

  connection.query(sql).then(results => {
    event.reply(SEARCH_CREATURE_TEMPLATE_LOCALES, results);
  });
});

// 根据条件得到指定的生物模板补充信息
ipcMain.on("FIND_CREATURE_TEMPLATE_ADDON", (event, payload) => {
  let sql = `select * from creature_template_addon where entry = ${payload.entry}`;

  connection
    .query(`${sql}`)
    .then(results => {
      event.reply("FIND_CREATURE_TEMPLATE_ADDON_REPLY", results[0]);
      event.reply("GLOBAL_NOTICE", `${sql}`);
    })
    .catch(error => {
      event.reply("GLOBAL_NOTICE", error);
    });
});

// 根据条件得到指定的生物击杀声望奖励
ipcMain.on("FIND_CREATURE_ONKILL_REPUTATION", (event, payload) => {
  let sql = `select * from creature_onkill_reputation where creature_id = ${payload.creatureId}`;

  connection
    .query(`${sql}`)
    .then(results => {
      event.reply("FIND_CREATURE_ONKILL_REPUTATION_REPLY", results[0]);
      event.reply("GLOBAL_NOTICE", `${sql}`);
    })
    .catch(error => {
      event.reply("GLOBAL_NOTICE", error);
    });
});

// 搜索满足条件的生物装备模板
ipcMain.on("SEARCH_CREATURE_EQUIP_TEMPLATES", (event, payload) => {
  let sql = `select cet.*, it1.displayid as displayid1, it1.name as name1, itl1.Name as Name1, it2.displayid as displayid2, it2.name as name2, itl2.Name as Name2, it3.displayid as displayid3, it3.name as name3, itl3.Name as Name3 from creature_equip_template as cet left join item_template as it1 on cet.ItemID1 = it1.entry left join item_template_locale as itl1 on cet.ItemID1 = itl1.ID and itl1.locale = 'zhCN' left join item_template as it2 on cet.ItemID2 = it2.entry left join item_template_locale as itl2 on cet.ItemID2 = itl2.ID and itl2.locale = 'zhCN' left join item_template as it3 on cet.ItemID3 = it3.entry left join item_template_locale as itl3 on cet.ItemID3 = itl3.ID and itl3.locale = 'zhCN' where cet.CreatureID = ${payload.creatureId}`;

  connection
    .query(`${sql}`)
    .then(results => {
      event.reply("SEARCH_CREATURE_EQUIP_TEMPLATES_REPLY", results);
      event.reply("GLOBAL_NOTICE", `${sql}`);
    })
    .catch(error => {
      event.reply("GLOBAL_NOTICE", error);
    });
});

// 搜索满足条件的商人信息
ipcMain.on("SEARCH_NPC_VENDORS", (event, payload) => {
  let sql = `select nv.*, it.displayid, it.name, itl.Name from npc_vendor as nv left join item_template as it on nv.item = it.entry left join item_template_locale as itl on nv.item = itl.ID and itl.locale='zhCN' where nv.entry = ${payload.entry}`;

  connection
    .query(`${sql}`)
    .then(results => {
      event.reply("SEARCH_NPC_VENDORS_REPLY", results);
      event.reply("GLOBAL_NOTICE", `${sql}`);
    })
    .catch(error => {
      event.reply("GLOBAL_NOTICE", error);
    });
});

// 搜索满足条件的训练师信息
ipcMain.on("SEARCH_NPC_TRAINERS", (event, payload) => {
  let sql = `select * from npc_trainer where ID = ${payload.id}`;

  connection
    .query(`${sql}`)
    .then(results => {
      event.reply("SEARCH_NPC_TRAINERS_REPLY", results);
      event.reply("GLOBAL_NOTICE", `${sql}`);
    })
    .catch(error => {
      event.reply("GLOBAL_NOTICE", error);
    });
});

// 搜索满足条件的生物任务物品掉落
ipcMain.on("SEARCH_CREATURE_QUEST_ITEMS", (event, payload) => {
  let sql = `select cq.*, it.name, itl.Name as localeName from creature_questitem as cq left join item_template as it on cq.ItemId = it.entry left join item_template_locale as itl on it.entry = itl.ID and itl.locale='zhCN' where cq.CreatureEntry = ${payload.creatureEntry}`;

  connection
    .query(sql)
    .then(results => {
      event.reply("SEARCH_CREATURE_QUEST_ITEMS_REPLY", results);
      event.reply("GLOBAL_NOTICE", `${sql}`);
    })
    .catch(error => {
      event.reply("GLOBAL_NOTICE", error);
    });
});

// 搜索满足条件的生物击杀物品掉落
ipcMain.on("SEARCH_CREATURE_LOOT_TEMPLATES", (event, payload) => {
  let sql = `select clt.*, it.name, itl.Name as localeName from creature_loot_template as clt left join item_template as it on clt.Item = it.entry left join item_template_locale as itl on it.entry = itl.ID and itl.locale='zhCN' where clt.Entry = ${payload.entry}`;

  connection
    .query(sql)
    .then(results => {
      event.reply("SEARCH_CREATURE_LOOT_TEMPLATES_REPLY", results);
      event.reply("GLOBAL_NOTICE", `${sql}`);
    })
    .catch(error => {
      event.reply("GLOBAL_NOTICE", error);
    });
});

// 搜索满足条件的生物偷窃物品掉落
ipcMain.on("SEARCH_PICKPOCKETING_LOOT_TEMPLATES", (event, payload) => {
  let sql = `select plt.*, it.name, itl.Name as localeName from pickpocketing_loot_template as plt left join item_template as it on plt.Item = it.entry left join item_template_locale as itl on it.entry = itl.ID and itl.locale='zhCN' where plt.Entry = ${payload.entry}`;

  connection
    .query(sql)
    .then(results => {
      event.reply("SEARCH_PICKPOCKETING_LOOT_TEMPLATES_REPLY", results);
      event.reply("GLOBAL_NOTICE", `${sql}`);
    })
    .catch(error => {
      event.reply("GLOBAL_NOTICE", error);
    });
});

// 搜索满足条件的生物剥皮物品掉落
ipcMain.on("SEARCH_SKINNING_LOOT_TEMPLATES", (event, payload) => {
  let sql = `select slt.*, it.name, itl.Name as localeName from skinning_loot_template as slt left join item_template as it on slt.Item = it.entry left join item_template_locale as itl on it.entry = itl.ID and itl.locale='zhCN' where slt.Entry = ${payload.entry}`;

  connection
    .query(sql)
    .then(results => {
      event.reply("SEARCH_SKINNING_LOOT_TEMPLATES_REPLY", results);
      event.reply("GLOBAL_NOTICE", `${sql}`);
    })
    .catch(error => {
      event.reply("GLOBAL_NOTICE", error);
    });
});

// 获得当前生物模板中最大的ID
ipcMain.on("CREATURE_TEMPLATE_MAX_ID", (event, payload) => {
  maxEntry()
    .then(id => {
      event.reply("CREATURE_TEMPLATE_MAX_ID_REPLY", id);
    })
    .catch(error => {
      event.reply("GLOBAL_NOTICE", error);
    });
});
