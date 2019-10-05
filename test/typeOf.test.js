////////////////////////////
// Initialize
////////////////////////////
import { expect } from 'chai';
import { typeOf } from '../src/typeOf';
import { typesToTest, answers } from './utilities';

////////////////////////////
// Test
////////////////////////////
describe('typeOf()', function() {
    it('Should return type of supplied parameter', function() {
        const results = typesToTest.map(typeOf);

        results.forEach((result, idx) => {
            expect(result).to.equal(answers[idx].for);
        });
    });
});