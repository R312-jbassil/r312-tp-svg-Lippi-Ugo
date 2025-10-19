/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3423567578")

  // add relation field to link an svg to its owner (users)
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "rel_user_001",
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation",
    "collectionId": "_pb_users_auth_",
    "cascadeDelete": false,
    "maxSelect": 1,
    "minSelect": 0,
    "displayFields": []
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3423567578")

  // remove relation field
  collection.fields.removeById("rel_user_001")

  return app.save(collection)
})
