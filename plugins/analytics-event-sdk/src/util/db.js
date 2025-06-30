/*
* 删除源数组的项
* 保证删除的同时 不会影响原数组的push
*
* 建议 可以直接使用map 提高效率
* */
export class JsDB {
    constructor(dataList) {
        if (dataList) {
            this.dataList = dataList;
        }
    }

    // [ {} ]
    dataList = []

    get length() {
        return this.dataList.length;
    }

    insert(item) {
        this.dataList.push(item)
    }

    delete() {
        //
    }

    deleteList(item, key) {
        this._removeFromArray(this.dataList, item, key);
    }

    // // 示例：
    // const targetArray = [
    //     {id: 1, name: "Alice"},
    //     {id: 2, name: "Bob"},
    //     {id: 3, name: "Charlie"},
    // ];
    // const sourceArray = [
    //     {id: 2, name: "Bob"},
    //     {id: 4, name: "David"}, // 不会被删除，因为不在 targetArray 中
    // ];
    // removeFromArray(targetArray, sourceArray, "id"); // 使用 id 属性进行比较
    _removeFromArray(targetArray, sourceArray, propertyToCompare) {
        sourceArray.forEach(sourceItem => {
            const index = targetArray.findIndex(targetItem => targetItem[propertyToCompare] === sourceItem[propertyToCompare]);
            if (index !== -1) {
                targetArray.splice(index, 1);
            }
        });
    }
}
