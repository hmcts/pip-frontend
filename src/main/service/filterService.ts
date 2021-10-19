
export class FilterService {
  generateCheckboxObjects(items, checkedItems): any {
    const itemsList = [];
    items.forEach((itemValue, itemKey) => {
      const incrementKey = itemKey + 1;
      itemsList.push({
        value: incrementKey,
        text: itemValue,
        checked: checkedItems.includes(incrementKey),
      });
    });
    return itemsList;
  }

  generateCheckboxGroup(items, groupName = ''): any {
    return {
      idPrefix: groupName.toLowerCase(),
      name: groupName.toLowerCase(),
      classes: 'govuk-checkboxes--small',
      fieldset: {
        legend: {
          text: groupName,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items,
    };
  }
}
