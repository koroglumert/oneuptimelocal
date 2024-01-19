import LocalCache from 'CommonServer/Infrastructure/LocalCache';
import { ExpressRequest, ExpressResponse } from 'CommonServer/Utils/Express';
import LocalFile from 'CommonServer/Utils/LocalFile';
import ResourceUtil, { ModelDocumentation } from '../Utils/Resources';
import { CodeExamplesPath, ViewsPath } from '../Utils/Config';

const Resources: Array<ModelDocumentation> = ResourceUtil.getResources();

export default class ServiceHandler {
    public static async executeResponse(
        _req: ExpressRequest,
        res: ExpressResponse
    ): Promise<void> {
        const pageData: any = {};

        pageData.selectCode = await LocalCache.getOrSetString(
            'data-type',
            'select',
            async () => {
                return await LocalFile.read(
                    `${CodeExamplesPath}/DataTypes/Select.md`
                );
            }
        );

        pageData.sortCode = await LocalCache.getOrSetString(
            'data-type',
            'sort',
            async () => {
                return await LocalFile.read(
                    `${CodeExamplesPath}/DataTypes/Sort.md`
                );
            }
        );

        pageData.equalToCode = await LocalCache.getOrSetString(
            'data-type',
            'equal-to',
            async () => {
                return await LocalFile.read(
                    `${CodeExamplesPath}/DataTypes/EqualTo.md`
                );
            }
        );

        pageData.equalToOrNullCode = await LocalCache.getOrSetString(
            'data-type',
            'equal-to-or-null',
            async () => {
                return await LocalFile.read(
                    `${CodeExamplesPath}/DataTypes/EqualToOrNull.md`
                );
            }
        );

        pageData.greaterThanCode = await LocalCache.getOrSetString(
            'data-type',
            'greater-than',
            async () => {
                return await LocalFile.read(
                    `${CodeExamplesPath}/DataTypes/GreaterThan.md`
                );
            }
        );

        pageData.greaterThanOrEqualCode = await LocalCache.getOrSetString(
            'data-type',
            'greater-than-or-equal',
            async () => {
                return await LocalFile.read(
                    `${CodeExamplesPath}/DataTypes/GreaterThanOrEqual.md`
                );
            }
        );

        pageData.lessThanCode = await LocalCache.getOrSetString(
            'data-type',
            'less-than',
            async () => {
                return await LocalFile.read(
                    `${CodeExamplesPath}/DataTypes/LessThan.md`
                );
            }
        );

        pageData.lessThanOrEqualCode = await LocalCache.getOrSetString(
            'data-type',
            'less-than-or-equal',
            async () => {
                return await LocalFile.read(
                    `${CodeExamplesPath}/DataTypes/LessThanOrEqual.md`
                );
            }
        );

        pageData.isNullCode = await LocalCache.getOrSetString(
            'data-type',
            'is-null',
            async () => {
                return await LocalFile.read(
                    `${CodeExamplesPath}/DataTypes/IsNull.md`
                );
            }
        );

        pageData.notNullCode = await LocalCache.getOrSetString(
            'data-type',
            'not-null',
            async () => {
                return await LocalFile.read(
                    `${CodeExamplesPath}/DataTypes/NotNull.md`
                );
            }
        );

        pageData.notEqualToCode = await LocalCache.getOrSetString(
            'data-type',
            'not-equals',
            async () => {
                return await LocalFile.read(
                    `${CodeExamplesPath}/DataTypes/NotEqualTo.md`
                );
            }
        );

        res.status(200);
        return res.render(`${ViewsPath}/pages/index`, {
            page: 'data-types',
            pageTitle: 'Data Types',
            pageDescription:
                'Data Types that can be used to interact with OneUptime API',
            resources: Resources,
            pageData: pageData,
        });
    }
}
