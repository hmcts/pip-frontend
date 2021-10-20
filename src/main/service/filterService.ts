
export class FilterService {
  generateCheckboxObjects(items, checkedItems): any {
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

  // TODO: this logic should be done on the back end
  filterObject(allCourts, filteringList, filterValues): any {
    const recordsToRemove = [];
    const filtersList = this.splitFilters(filterValues);
    if (filteringList.length > 0) {
      allCourts.forEach((court) => {
        const comparisons = [];
        filtersList.forEach((filter) => {
          const attributeName = Object.keys(filter)[0]; // jurisdiction or location
          // check whether court has a value and push 1 (true)
          if (court[attributeName] === filter[attributeName]) {
            comparisons.push(1);
          }
        });
        // if there is no 1 (true) in the list it means that element should be filtered out
        if (!comparisons.includes(1)) {
          recordsToRemove.push(court.name);
        }
      });
    }
    return this.removeRecords(filteringList, recordsToRemove);
  }

  splitFilters(filterValues): any[] {
    const filters = [];
    filterValues.forEach((filter) => {
      const objectKey = Object.keys(filter)[0]; // jurisdiction or location
      if (filter[objectKey].length) {
        filter[objectKey].forEach((filterVal) => {
          const filterObject = {};
          filterObject[objectKey] = filterVal;
          filters.push(filterObject);
        });
      }
    });
    return filters;
  }

  removeRecords(recordsList, recordsToRemove): object {
    const records = recordsList;
    recordsToRemove.forEach((record) => {
      const firstChar = record.charAt(0);
      delete records[firstChar][record];
    });
    return records;
  }
}
