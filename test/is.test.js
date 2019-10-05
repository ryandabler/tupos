////////////////////////////
// Initialize
////////////////////////////
import { expect } from 'chai';
import { is } from '../src/is';
import { typesToTest, answers, getNTypes } from './utilities';

////////////////////////////
// Test
////////////////////////////
describe('is()', function() {
    it('Should return a function when called', function() {
        const [ type ] = getNTypes(1)
        const result = is(...type);
        
        expect(result).to.be.an.instanceof(Function);
    });

    it('Should put a `.for` property on return function', function() {
        const [ type ] = getNTypes(1)
        const result = is(...type);

        expect(result).to.have.property('for');
    });
    // TODO: ensure this test returns true in exactly one situation
    it('Should return true', function() {
        const closures = answers.map($type => is($type.for));

        closures.forEach((closure, idx) => {
            expect(closure(typesToTest[idx])).to.be.true;
        });
    });

    it('Should return false', function() {
        const closures = answers.map(is);

        closures.forEach((closure, idx) => {
            expect(
                closure(typesToTest[idx === 0 ? closures.length - 1 : idx - 1])
            ).to.be.false;
        });
    });
});