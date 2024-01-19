import { PermissionHelper, PermissionProps } from 'Common/Types/Permission';
import { ExpressRequest, ExpressResponse } from 'CommonServer/Utils/Express';
import ResourceUtil, { ModelDocumentation } from '../Utils/Resources';
import { ViewsPath } from '../Utils/Config';

const Resources: Array<ModelDocumentation> = ResourceUtil.getResources();

export default class ServiceHandler {
    public static async executeResponse(
        req: ExpressRequest,
        res: ExpressResponse
    ): Promise<void> {
        let pageTitle: string = '';
        let pageDescription: string = '';
        const page: string | undefined = req.params['page'];
        const pageData: any = {};

        pageTitle = 'Permissions';
        pageDescription = 'Learn how permissions work with OneUptime';

        pageData.permissions = PermissionHelper.getAllPermissionProps().filter(
            (i: PermissionProps) => {
                return i.isAssignableToTenant;
            }
        );

        return res.render(`${ViewsPath}/pages/index`, {
            page: page,
            resources: Resources,
            pageTitle: pageTitle,
            pageDescription: pageDescription,
            pageData: pageData,
        });
    }
}
