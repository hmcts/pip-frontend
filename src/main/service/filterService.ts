
export class FilterService {
  public getDistinctValues(filterName: string, list: Array<any>): any {
    return [...new Set(list.map(item => item[filterName]))];
  }

  public generateCheckboxObjects(items, checkedItems): any {
    const itemsList = [];
    items.forEach((itemValue) => {
      itemsList.push({
        value: itemValue,
        text: itemValue,
        checked: checkedItems.includes(itemValue),
      });
    });
    return itemsList;
  }

  public generateCheckboxGroup(items, groupName = ''): any {
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

  public generateSelectedTags(filterValues): object[] {
    const selectedTags = [];
    //  filteredValues = [ { jurisdiction: [selections] }, { location: [selections] } ]
    if (filterValues.length) {
      filterValues.forEach((filter) => {
        const objectKeys = Object.keys(filter);
        if (objectKeys.length) {
          const filterName = objectKeys[0];
          // if there are no selected filters do not add categories
          if (filter[filterName].length > 0) {
            const category = { heading: { text: filterName[0].toUpperCase() + filterName.slice(1) }, items: [] };
            filter[filterName].forEach((filterItem) => {
              category.items.push({ href: `?clear=${filterItem}`, text: filterItem});
            });
            selectedTags.push(category);
          }
        }
      });
    }
    return selectedTags;
  }
}
