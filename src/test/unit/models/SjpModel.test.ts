import {describe} from "@jest/globals";
import { SjpModel } from '../../../main/models/style-guide/sjp-model';

describe('SJP Model Test', () => {

    it('test add total case number', () => {
        let sjpModel = new SjpModel();
        sjpModel.addTotalCaseNumber();
        expect(sjpModel.totalNumberOfCases).toBe(1);
    });

    it('test set current page when page is not defined', () => {
        let sjpModel = new SjpModel();
        expect(sjpModel.setCurrentPage(undefined)).toBe(1);
    });

    it('test set current page when page is not a number', () => {
        let sjpModel = new SjpModel();
        expect(sjpModel.setCurrentPage(["a", "b"])).toBe(1);
    });

    it('test set current page when page is a number', () => {
        let sjpModel = new SjpModel();
        expect(sjpModel.setCurrentPage("4")).toBe(4);
    });

    it('test add a postcode when not london area', () => {
        let sjpModel = new SjpModel();
        sjpModel.addPostcode("AA1 AAA");

        expect(sjpModel.postcodes).toContain("AA1");
        expect(sjpModel.hasLondonPostcodeArea).toBe(false);
    });

    it('test add a postcode when london area', () => {
        let sjpModel = new SjpModel();
        sjpModel.addPostcode("E1 AAA");

        expect(sjpModel.postcodes).toContain("E1");
        expect(sjpModel.hasLondonPostcodeArea).toBe(true);
    });

    it('test add a prosecutor', () => {
        let sjpModel = new SjpModel();
        sjpModel.addProsecutor("This is a prosecutor");

        expect(sjpModel.prosecutors).toContain("This is a prosecutor");
    });

    it('test sort postcodes', () => {
        let sjpModel = new SjpModel();
        sjpModel.addPostcode("Z1");
        sjpModel.addPostcode("A1");
        sjpModel.addPostcode("B1");


        expect(sjpModel.sortPostcodes()).toEqual(["A1", "B1", "Z1"]);
    });

    it('test sort prosecutors', () => {
        let sjpModel = new SjpModel();
        sjpModel.addProsecutor("Prosecutor 4");
        sjpModel.addProsecutor("Prosecutor 2");
        sjpModel.addProsecutor("Prosecutor 8");


        expect(sjpModel.sortProsecutors()).toEqual(["Prosecutor 2", "Prosecutor 4", "Prosecutor 8"]);
    });

    it('test set current filter values', () => {
        let sjpModel = new SjpModel();
        sjpModel.setCurrentFilterValues(["Filter 1", "Filter 2"]);
        expect(sjpModel.currentFilterValues).toEqual(["Filter 1", "Filter 2"]);
    });

    it('test add filtered case', () => {
        let sjpModel = new SjpModel();
        sjpModel.addFilteredCase({test: "Test 1"})
        expect(sjpModel.filteredCases).toEqual([{test: "Test 1"}]);
    });

    it('test is row within page limit when below range', () => {
        let sjpModel = new SjpModel();

        sjpModel.setCurrentPage(1);
        sjpModel.countOfFilteredCases = 2000;

        expect(sjpModel.isRowWithinPage()).toEqual(false);
    });

    it('test is row within page limit when inside range', () => {
        let sjpModel = new SjpModel();

        sjpModel.setCurrentPage(2);
        sjpModel.countOfFilteredCases = 2000;

        expect(sjpModel.isRowWithinPage()).toEqual(true);
    });

    it('test is row within page limit when above range', () => {
        let sjpModel = new SjpModel();

        sjpModel.setCurrentPage(3);
        sjpModel.countOfFilteredCases = 2000;

        expect(sjpModel.isRowWithinPage()).toEqual(false);
    });

    it('test generate postcode filters', () => {
        let sjpModel = new SjpModel();

        sjpModel.addPostcode("AA2");
        sjpModel.addPostcode("AA1");
        sjpModel.addPostcode("E1")
        sjpModel.setCurrentFilterValues(["AA1"]);

        expect(sjpModel.generatePostcodeFilters()).toEqual([{
            value: "AA1",
            text: "AA1",
            checked: true
        }, {
            value: "AA2",
            text: "AA2",
            checked: false
        },{
            value: "E1",
            text: "E1",
            checked: false
        }, {
            value: "London Postcodes",
            text: "London Postcodes",
            checked: false
        }]);
    });

    it('test generate prosecutor filters', () => {
        let sjpModel = new SjpModel();

        sjpModel.addProsecutor("This is a prosecutor 4");
        sjpModel.addProsecutor("This is a prosecutor 2");
        sjpModel.addProsecutor("This is a prosecutor 3")
        sjpModel.setCurrentFilterValues(["Thisisaprosecutor4"]);

        expect(sjpModel.generateProsecutorFilters()).toEqual([{
            value: "Thisisaprosecutor2",
            text: "This is a prosecutor 2",
            checked: false
        }, {
            value: "Thisisaprosecutor3",
            text: "This is a prosecutor 3",
            checked: false
        },{
            value: "Thisisaprosecutor4",
            text: "This is a prosecutor 4",
            checked: true
        }]);
    });

});
