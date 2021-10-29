
export class FilterService {
  public getDistinctValues(filterName: string, list: any[]): string[] {
    return [...new Set(list.map(item => item[filterName]))];
  }

  public generateCheckboxObjects(checkedItems: any[], filterName: string, list: any[]): object[] {
    const items = this.getDistinctValues(filterName, list);
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

  public generateCheckboxGroup(checkedItems: any[], groupName = '', list: any[]): object {
    // workaround to convert region to location as it is currently mapped under location attribute
    const _groupName =  groupName === 'Region' ? 'location' : groupName;
    const items = this.generateCheckboxObjects(checkedItems, _groupName.toLowerCase(), list);
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

  public generateSelectedTags(filterValues: any[]): object[] {
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

  public getFilterValues(filtersObject: object): string[] {
    const objectKeys = Object.keys(filtersObject);
    const filterValues = [];
    objectKeys.forEach((objKey) => {
      if (filtersObject[objKey].length > 0) {
        objKey === 'region' ? filterValues.push('location') : filterValues.push(objKey);
      }
    });
    return filterValues;
  }
}
