import {fields2CtrContent, getCtorParaStr, j2Jtj} from "../transfer";
import {TypeInfoI} from "../../../../typings";

/**
 * @desc
 *
 * @使用场景
 *
 * @company qianmi.com
 * @Date    2018/4/8
 **/

let enums = ["com.qianmi.yxtc.enums.BusiTypeEnum"],
  beans = ["com.qianmi.yxtc.domain.PayMethodInfo"];
let typeInfo: Map<string, TypeInfoI> = new Map();

enums.forEach(item => {
  typeInfo.set(item, {
    classPath: item,
    className: item.substring(item.lastIndexOf(".") + 1),
    packagePath: item.substring(0, item.lastIndexOf(".")),
    isProvider: false,
    isClass: false,
    isEnum: true,
    typeParameters: []
  });
});


beans.forEach(item => {
  typeInfo.set(item, {
    classPath: item,
    className: item.substring(item.lastIndexOf(".") + 1),
    packagePath: item.substring(0, item.lastIndexOf(".")),
    isProvider: false,
    isClass: true,
    isEnum: false,
    typeParameters: []
  });
});

let typeOptions = {
  isTypeParam: typeName => {
    return ["T"].includes(typeName);
  },
  hasAst: (classPath: string) => {
    return enums.includes(classPath) || beans.includes(classPath);
  },
  addDenpend: async (classPath: string) => {
    return;
  },
  getTypeInfo: (classPath: string) => {
    if (typeInfo.has(classPath)) {
      return typeInfo.get(classPath);
    } else {
      return {classPath: "", packagePath: "", className: "", isProvider: false, isClass: false, isEnum: false};
    }
  },
};

describe("构造函数生成", () => {
  it("无泛型参数的", async () => {
    let content = getCtorParaStr("ItemCreateRequest");
    expect(content).toEqual("IItemCreateRequest");
  });

  it("有多个泛型参数的", async () => {
    let content = getCtorParaStr("ItemCreateRequest", [
      {
        name: "T"
      },
      {
        name: "W"
      },
    ]);
    expect(content).toEqual("IItemCreateRequest<T,W>");
  });
});

describe("基础转换生成", () => {
  it("枚举类型", async () => {
    let content = j2Jtj(typeOptions, {
      paramRefName: "item",
      classPath: "com.qianmi.yxtc.enums.BusiTypeEnum"
    });
    expect(content).toMatchSnapshot();
  });

  it("对象类型", async () => {
    let content = j2Jtj(typeOptions, {
      paramRefName: "item",
      classPath: "com.qianmi.yxtc.domain.PayMethodInfo"
    });
    expect(content).toEqual("item.__fields2java()");
  });

  it("泛型对象类型", async () => {
    let content = j2Jtj(typeOptions, {
      paramRefName: "item",
      classPath: "T"
    });
    expect(content).toEqual(
      "item['__fields2java']?item['__fields2java']():item"
    );
  });

  it("时间类型", async () => {
    let content = j2Jtj(typeOptions, {
      paramRefName: "item",
      classPath: "java.util.Date"
    });
    expect(content).toEqual("item");
  });

  it("java.lang.类型", async () => {
    let content = j2Jtj(typeOptions, {
      paramRefName: "item",
      classPath: "java.lang.String"
    });
    expect(content).toEqual("java.String(item)");
  });
});

describe("map<string,List<string>>转换方法", () => {
  it("map类型转换生成", async () => {
    let {fieldTrans, initContent} = await fields2CtrContent(
      [
        {
          name: "billIdMap",
          filedAst: typeDef.fields.billIdMap
        },
      ],
      typeOptions,
      typeDef
    );
    expect(initContent).toMatchSnapshot();
    expect(fieldTrans.join(",")).toEqual(
      "billIdMap:java.Map(billIdMapMapTransfer)"
    );
  });

  it("Map<string,List<object>>转换方法", async () => {
    let {fieldTrans, initContent} = await fields2CtrContent(
      [
        {
          name: "cats",
          filedAst: typeDef.fields.cats
        },
      ],
      typeOptions,
      typeDef
    );
    expect(initContent).toEqual("");
    expect(fieldTrans.join(",")).toMatchSnapshot();
  });
});

const typeDef = {
  fields: {
    cats: {
      isArray: false,
      name: "java.util.List",
      typeArgs: [
        {
          isWildcard: false,
          type: {
            isArray: false,
            name: "java.util.Map",
            typeArgs: [
              {
                isWildcard: false,
                type: {
                  isArray: false,
                  name: "java.lang.String",
                  typeArgs: []
                },
              },
              {
                isWildcard: false,
                type: {
                  isArray: false,
                  name: "java.lang.Object",
                  typeArgs: []
                },
              },
            ],
          },
        },
      ],
    },
    billIdMap: {
      isArray: false,
      name: "java.util.Map",
      typeArgs: [
        {
          isWildcard: false,
          type: {
            isArray: false,
            name: "java.lang.String",
            typeArgs: []
          },
        },
        {
          isWildcard: false,
          type: {
            isArray: false,
            name: "java.util.List",
            typeArgs: [
              {
                isWildcard: false,
                type: {
                  isArray: false,
                  name: "java.lang.String",
                  typeArgs: []
                },
              },
            ],
          },
        },
      ],
    },
  },
  isEnum: false,
  isInterface: false,
  methods: {
    getAllJobDetails: {
      formalParams: [],
      isOverride: false,
      params: [],
      ret: {
        isArray: false,
        name: "java.util.Map",
        typeArgs: []
      },
      typeParams: []
    },
  },
  name: "com.qianmi.pc.api.app.stock.response.AppBillIdGetResponse",
  values: [],
  typeParams: []
};