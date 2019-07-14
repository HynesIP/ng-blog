import { NgHelper } from '../../helpers/ng';
import { ShellHelper } from '../../helpers/shell';

const ngHelper = new NgHelper();

describe('Angular Helper Tests', () => {
    beforeEach(() => {
        const _shellHelper = new ShellHelper();
        _shellHelper.run('rm -rf ./temp');
        _shellHelper.run('mkdir ./temp');
    });

    describe('#createNewAngularApp()', () => {
        it("should do what it's told", () => {
            ngHelper.createNewAngularApp('./temp');
        });
    });
});
