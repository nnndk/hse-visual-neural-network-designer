export const applyDrag = (arr, dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;
  
    const result = copyObj(arr);
    let itemToAdd = copyObj(payload);
    itemToAdd.id = generateGuid();
  
    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }
  
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }
  
    return result;
  };

  export const generateGuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  export const copyObj = (obj) => JSON.parse(JSON.stringify(obj));

  export const getFileName = (library) => {
    const currentDate = new Date();

    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const currentTimeString = `${hours}_${minutes}_${seconds}`;

    return `${library}_model_${currentTimeString}`;
  }

  export const convertToProperType = (value) => {

    if (value.toLowerCase() === 'null' || value === null) {
        return null;
    }

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === 'string' && value.includes(',')) {
      return value.split(',').map(item => convertToProperType(item.trim()));
    }

    let floatValue = parseFloat(value);
    if (!isNaN(floatValue)) {
        return floatValue;
    }

    let intValue = parseInt(value, 10);
    if (!isNaN(intValue)) {
        return intValue;
    }
    
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
        return value.toLowerCase() === 'true';
    }

    return value;
}

export const getTypeForInput = (value) => {
  if(value === null)
    return "text";
  else if (typeof value === 'boolean' || (value.toLowerCase() === 'true' || value.toLowerCase() === 'false'))
    return "checkbox";
  else
    return "text";
}