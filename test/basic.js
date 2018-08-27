const assert = require('assert');
const should = require('should');
const {exec} = require('child_process');

describe('sanity check', () => {
    it('should pass', () => {
        assert(1 + 1 === 2);
    });
});

describe('code-stats', () => {
    describe('code-stats <paths>', () => {
        it('should show line counts for each type', (done) => {
            exec('./code-stats test/fixtures', (err, stdout) => {
                should.not.exist(err);
                const expected = `
 Filetype | Line count
-----------------------
       js | 1000
        c | 900
       rb | 800
       py | 700
     java | 600
     scss | 10
~~~~~~~~~~~~~~~~~~~~~~~
      All | 4010
`;
                stdout.should.equal(expected);
                done();
            });
        });
    });

    describe('-x, --exclude <pattern>', () => {
        it('should exclude files in addition to defaults', (done) => {
            exec("./code-stats -x 'js|java' test/fixtures", (err, stdout) => {
                should.not.exist(err);
                const expected = `
 Filetype | Line count
-----------------------
        c | 900
       rb | 800
       py | 700
     scss | 10
~~~~~~~~~~~~~~~~~~~~~~~
      All | 2410
`;
                stdout.should.equal(expected);
                done();
            });
        });
    });
});
