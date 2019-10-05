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

    describe('The return function', function() {
        it('Should return true for exactly one type', function() {
            const closures = answers.map($type => is($type.for));
    
            closures.forEach((closure, idx) => {
                expect(closure(typesToTest[idx])).to.be.true;
                expect(
                    typesToTest.filter((_, _idx) => _idx !== idx).some(closure)
                ).to.not.be.true;
            });
        });
    
        it('Should return false for all other types', function() {
            const closures = answers.map($type => is($type.for));
    
            closures.forEach((closure, idx) => {
                expect(
                    typesToTest.filter((_, _idx) => _idx !== idx).every(type => closure(type) === false)
                ).to.be.true;
            });
        });
    })
});