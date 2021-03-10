import { normalizeAmount, trimZeros, convertToE24Base, convertToDecimals } from '../src/services/near-nep21-util'
import { assert } from "chai";

describe("Normalize Accounts ", () => {
    
    it("should trim zeros ", () => {
        let res = trimZeros("000.12");
        assert.equal(res, ".12", 'mismatch');

        res = trimZeros("0.32");
        assert.equal(res, ".32", 'mismatch');

        res = trimZeros("5.32");
        assert.equal(res, "5.32", 'mismatch');

        res = trimZeros("0.32000");
        assert.equal(res, ".32", 'mismatch');

        res = trimZeros("1000");
        assert.equal(res, "1000", 'mismatch');

        res = trimZeros("0020");
        assert.equal(res, "20", 'mismatch');

        res = trimZeros("0.0");
        assert.equal(res, "0", 'mismatch');

        res = trimZeros("000.00000");
        assert.equal(res, "0", 'mismatch');

        res = trimZeros("00");
        assert.equal(res, "0", 'mismatch');
    });

    it("normalize amounts ", () => {
        let res = normalizeAmount(".12", 24);
        assert.equal(res, "120000000000000000000000", 'mismatch');

        res = normalizeAmount("42", 24);
        assert.equal(res, "42000000000000000000000000", 'mismatch');

        res = normalizeAmount("42", 2);
        assert.equal(res, "4200", 'mismatch');

        res = normalizeAmount("42", 0);
        assert.equal(res, "42", 'mismatch');

        res = normalizeAmount("4.122", 4);
        assert.equal(res, "41220", 'mismatch');

        res = normalizeAmount("4.22342", 5);
        assert.equal(res, "422342", 'mismatch');
    });
});

describe("Convert to real number", () => {

    it("Division ",  () => {
        let res = convertToE24Base("1000000000000000000000000");
        assert.equal(res, "1.000000000000000000000000", 'mismatch');
        
        res = convertToE24Base("10000000000000000000000");
        assert.equal(res, "0.010000000000000000000000", 'mismatch');

        res = convertToE24Base("1234567891234567891234567");
        assert.equal(res, "1.234567891234567891234567", 'mismatch');

        res = convertToE24Base("1234567891234567894567");
        assert.equal(res, "0.001234567891234567894567", 'mismatch');

        res = convertToE24Base("1");
        assert.equal(res, "0.000000000000000000000001", 'mismatch');

        res = convertToE24Base("0");
        assert.equal(res, "0."+"0".repeat(24), 'mismatch');

        res = convertToE24Base("00");
        assert.equal(res, "0."+"0".repeat(24), 'mismatch');

        res = convertToE24Base("12340000000000000000000000000");
        assert.equal(res, "12340."+"0".repeat(24), 'mismatch');

        res = convertToE24Base("12340000000000000000000000001");
        assert.equal(res, "12340.000000000000000000000001", 'mismatch');
    });

    it("should convert number according to decimals, Returns result till 5 decimals", () => {
        let res = convertToDecimals("100", 1);
        assert.equal(res, "10.0", "Mismatch");
        
        res = convertToDecimals("1234567891234567891234567", 24);
        assert.equal(res, "1.234567891234567891234567", 'mismatch');

        res = convertToDecimals("1234567891234567894567", 24);
        assert.equal(res, "0.001234567891234567894567", 'mismatch');

        res = convertToDecimals("0", 24);
        assert.equal(res, "0.0", 'mismatch');

        res = convertToDecimals("1234567654321", 5);
        assert.equal(res, "12345676.54321", 'mismatch');

        res = convertToDecimals("1234567654321", 6);
        assert.equal(res, "1234567.654321", 'mismatch');

        res = convertToDecimals("1234567654321", 0);
        assert.equal(res, "1234567654321", 'mismatch');

        res = convertToDecimals("1", 6);
        assert.equal(res, "0.000001", 'mismatch');

        res = convertToDecimals("11", 6);
        assert.equal(res, "0.000011", 'mismatch');

        res = convertToDecimals("1234567", 6);
        assert.equal(res, "1.234567", 'mismatch');

        res = convertToDecimals("1000000", 6);
        assert.equal(res, "1.000000", 'mismatch');

        res = convertToDecimals("1200000", 6);
        assert.equal(res, "1.200000", 'mismatch');

        res = convertToDecimals("12300000", 6);
        assert.equal(res, "12.300000", 'mismatch');
    });
});