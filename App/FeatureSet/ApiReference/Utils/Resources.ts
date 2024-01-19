import BaseModel from 'Common/Models/BaseModel';
import Models from 'Model/Models/Index';
import ArrayUtil from 'Common/Types/ArrayUtil';
import Dictionary from 'Common/Types/Dictionary';
import { IsBillingEnabled } from 'CommonServer/EnvironmentConfig';

export interface ModelDocumentation {
    name: string;
    path: string;
    model: BaseModel;
    description: string;
}

export default class ResourceUtil {
    public static getResources(): Array<ModelDocumentation> {
        const resources: Array<ModelDocumentation> = Models.filter(
            (model: typeof BaseModel) => {
                const modelInstance: BaseModel = new model();
                let showDocs: boolean = modelInstance.enableDocumentation;

                if (modelInstance.isMasterAdminApiDocs && IsBillingEnabled) {
                    showDocs = false;
                }

                return showDocs;
            }
        )
            .map((model: typeof BaseModel) => {
                const modelInstance: BaseModel = new model();

                return {
                    name: modelInstance.singularName!,
                    path: modelInstance.getAPIDocumentationPath(),
                    model: modelInstance,
                    description: modelInstance.tableDescription!,
                };
            })
            .sort(ArrayUtil.sortByFieldName('name'));

        return resources;
    }

    public static getFeaturedResources(): Array<ModelDocumentation> {
        const featuredResources: Array<string> = [
            'Monitor',
            'Scheduled Maintenance Event',
            'Status Page',
            'Incident',
            'Team',
            'On-Call Duty',
            'Label',
            'Team Member',
        ];

        return ResourceUtil.getResources().filter(
            (resource: ModelDocumentation) => {
                return featuredResources.includes(resource.name);
            }
        );
    }

    public static getResourceDictionaryByPath(): Dictionary<ModelDocumentation> {
        const dict: Dictionary<ModelDocumentation> = {};

        const resources: Array<ModelDocumentation> =
            ResourceUtil.getResources();

        for (const resource of resources) {
            dict[resource.path] = resource;
        }

        return dict;
    }
}
