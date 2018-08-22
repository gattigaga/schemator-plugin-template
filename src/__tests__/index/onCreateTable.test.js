import { onCreateTable } from "../../index";

Date.now = jest.fn(() => 1534939718031);

describe("onCreateTable()", () => {
  it("should returns new table with it's fields", () => {
    const position = {
      x: 64,
      y: 64
    };

    const table = {
      id: expect.any(String),
      name: "MyTable",
      options: [
        {
          id: "optionID",
          label: "Option ID",
          isChecked: true
        }
      ],
      position,
      timestamp: Date.now()
    };

    const fields = [
      {
        id: expect.any(String),
        tableID: table.id,
        name: "fieldName",
        type: "typeID"
      }
    ];

    const expected = {
      table,
      fields
    };

    const result = onCreateTable(position);

    expect(result).toEqual(expected);
  });
});
