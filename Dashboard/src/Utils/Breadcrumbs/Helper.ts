import Dictionary from 'Common/Types/Dictionary';
import Link from 'Common/Types/Link';
import { RouteUtil } from '../RouteMap';
import Navigation from 'CommonUI/src/Utils/Navigation';

export function BuildBreadcrumbLinks(
    key: string,
    breadcrumpLinks: Link[]
): Dictionary<Link[]> {
    return {
        [RouteUtil.getRouteString(key)]: breadcrumpLinks,
    };
}

export function BuildBreadcrumbLinksByTitles(
    key: string,
    titles: Array<string>
): Dictionary<Link[]> {
    return {
        [RouteUtil.getRouteString(key)]: titles.map(
            (title: string, index: number) => {
                return {
                    title,
                    to: Navigation.getBreadcrumbRoute(index + 1),
                };
            }
        ),
    };
}
