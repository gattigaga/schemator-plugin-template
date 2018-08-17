import {
  createTable,
  createField,
  createOption,
  createRelation
} from "schemator-utils";

// Types would be used as field type in TableBox type selection.
const fieldTypes = [
  {
    id: "typeID",
    label: "Type ID"
  }
];

/**
 * Invoked while plugin initialized.
 * i.e. after create new project based on this plugin.
 * We can initialize new scheme here.
 *
 * @returns {object} Created scheme.
 */
const onInit = () => {
  // This will create a table named 'MyTable'
  // which has checkbox Option ID
  // and field named 'fieldName' with type 'typeID'
  // after project created.

  const tables = [
    createTable({
      name: "MyTable",
      options: [
        createOption({
          id: "optionID",
          label: "Option ID",
          isChecked: true
        })
      ],
      position: { x: 128, y: 128 }
    })
  ];

  const fields = [
    createField({
      tableID: tables[0].id,
      name: "fieldName",
      type: "typeID"
    })
  ];

  const scheme = {
    tables,
    fields
  };

  return scheme;
};

/**
 * Invoked while table would be created from context menu.
 * You can define table and field here.
 *
 * @param {object} cursorPosition Usually used as table position.
 * @param {number} cursorPosition.x
 * @param {number} cursorPosition.y
 * @returns {object} Created table with it's field.
 */
const onCreateTable = cursorPosition => {
  const table = createTable({
    name: "MyTable",
    options: [
      createOption({
        id: "optionID",
        label: "Option ID",
        isChecked: true
      })
    ],
    position: cursorPosition
  });

  const field = createField({
    tableID: table.id,
    name: "fieldName",
    type: "typeID"
  });

  const scheme = {
    table,
    field
  };

  return scheme;
};

/**
 * Invoked while field in a table would be created
 * from context menu or 'Add New Field' button.
 * You can define field data here.
 *
 * @param {string} tableID ID of table which has this field.
 * @returns {object} Created field.
 */
const onCreateField = tableID => {
  return createField({
    tableID,
    name: "fieldName",
    type: "typeID"
  });
};

/**
 * Invoked after table or field has been updated,
 * after onCreateTable or onCreateField called.
 * You can make relations here.
 *
 * @param {object} data Project data used for reference.
 * @param {object[]} tables All created tables.
 * @param {object[]} fields All created fields.
 * @returns {object[]} Created relations.
 */
const onUpdate = data => {
  // This will create all needed relations.

  const { tables, fields } = data;
  const foreignKeyFields = fields.filter(field => field.name.endsWith("_id"));
  const relations = foreignKeyFields.map(field => {
    const table = tables.find(table => {
      const tableName = `${table.name.toLowerCase()}_id`;
      const isMatch = field.name === tableName;

      return isMatch;
    });

    if (!table) {
      return null;
    }

    return createRelation({
      fieldID: field.id,
      fromTableID: field.tableID,
      toTableID: table.id
    });
  });

  return relations.filter(relation => !!relation);
};

/**
 * Invoked while project would be exported.
 * You can define exported data here.
 *
 * @param {string} destinationPath Path where project would be exported.
 * @param {object} data Project data used for reference.
 * @param {object[]} data.project Active project
 * @param {object[]} data.tables All created tables.
 * @param {object[]} data.fields All created fields.
 * @param {object[]} data.relations All created relations.
 * @returns {object} Paths and files which should be created.
 */
const onExport = (destinationPath, data) => {
  const byTable = tableID => field => field.tableID === tableID;

  const { project, tables, fields } = data;
  const exportPath = `${destinationPath}/${project.name}`;
  const paths = [exportPath];

  const files = tables.map(table => {
    const filename = `${table.name}.txt`;
    const content = fields
      .filter(byTable(table.id))
      .map(item => item.name)
      .join("\n");

    return {
      path: `${exportPath}/${filename}`,
      content
    };
  });

  return { paths, files };
};

export default {
  fieldTypes,
  onInit,
  onCreateTable,
  onCreateField,
  onUpdate,
  onExport
};
