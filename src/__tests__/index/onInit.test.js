import { onInit } from "../../index";

Date.now = jest.fn(() => 1534939718031);

describe("onInit()", () => {
  it("should returns initial scheme", () => {
    const tables = [
      {
        id: expect.any(String),
        name: "MyTable",
        options: [
          {
            id: "optionID",
            label: "Option ID",
            isChecked: true
          }
        ],
        position: { x: 128, y: 128 },
        timestamp: Date.now()
      }
    ];

    const fields = [
      {
        id: expect.any(String),
        tableID: tables[0].id,
        name: "fieldName",
        type: "typeID"
      }
    ];

    const expected = {
      tables,
      fields
    };

    const result = onInit();

    expect(result).toEqual(expected);
  });
});
