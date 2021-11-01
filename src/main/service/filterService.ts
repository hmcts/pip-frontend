
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

  public generateCheckboxGroups(checkedItems: object, list: any): object[] {
    const checkboxGroups = [];
    const checkedGroups = Object.keys(checkedItems);
    checkedGroups.forEach((group) => {
      const groupName = group === 'region' ? 'location' : group;
      const items = this.generateCheckboxObjects(checkedItems[group], groupName, list);
      const capitalizedGroup = group.charAt(0).toUpperCase() + group.slice(1);
      checkboxGroups.push({
        idPrefix: group,
        name: group,
        classes: 'govuk-checkboxes--small',
        fieldset: {
          legend: {
            text: capitalizedGroup,
            classes: 'govuk-fieldset__legend--m',
          },
        },
        items,
      });
    });
    return checkboxGroups;
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
            const filterTitle = filterName === 'location' ? 'Region' : filterName[0].toUpperCase() + filterName.slice(1);
            const category = { heading: { text: filterTitle }, items: [] };
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
