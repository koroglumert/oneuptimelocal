import React, { ReactElement, useEffect, useState } from 'react';
import BaseModel from 'Common/Models/BaseModel';
import { JSONObject } from 'Common/Types/JSON';
import ModelAPI from '../../Utils/ModelAPI/ModelAPI';
import Select from '../../Utils/ModelAPI/Select';
import Dictionary from 'Common/Types/Dictionary';
import ObjectID from 'Common/Types/ObjectID';
import Loader, { LoaderType } from '../Loader/Loader';
import { VeryLightGrey } from 'Common/Types/BrandColors';
import Permission, { PermissionHelper } from 'Common/Types/Permission';
import PermissionUtil from '../../Utils/Permission';
import { ColumnAccessControl } from 'Common/Types/BaseDatabase/AccessControl';
import Field from './Field';
import DetailField from '../Detail/Field';
import Detail from '../Detail/Detail';
import API from '../../Utils/API/API';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { useAsyncEffect } from 'use-async-effect';
import User from '../../Utils/User';

export interface ComponentProps<TBaseModel extends BaseModel> {
    modelType: { new (): TBaseModel };
    id: string;
    fields: Array<Field<TBaseModel>>;
    onLoadingChange?: undefined | ((isLoading: boolean) => void);
    modelId: ObjectID;
    onError?: ((error: string) => void) | undefined;
    onItemLoaded?: (item: TBaseModel) => void | undefined;
    refresher?: undefined | boolean;
    showDetailsInNumberOfColumns?: number | undefined;
    onBeforeFetch?: (() => Promise<JSONObject>) | undefined;
    selectMoreFields?: Select<TBaseModel>;
}

const ModelDetail: <TBaseModel extends BaseModel>(
    props: ComponentProps<TBaseModel>
) => ReactElement = <TBaseModel extends BaseModel>(
    props: ComponentProps<TBaseModel>
): ReactElement => {
    const [fields, setFields] = useState<Array<DetailField>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [item, setItem] = useState<TBaseModel | null>(null);

    const [onBeforeFetchData, setOnBeforeFetchData] = useState<
        JSONObject | undefined
    >(undefined);

    const getSelectFields: Function = (): Select<TBaseModel> => {
        const select: Select<TBaseModel> = {};
        for (const field of props.fields) {
            const key: string | null = field.field
                ? (Object.keys(field.field)[0] as string)
                : null;

            if (key) {
                (select as Dictionary<boolean>)[key] = true;
            }
        }

        for (const field of Object.keys(props.selectMoreFields || {})) {
            (select as Dictionary<boolean>)[field] = true;
        }

        return select;
    };

    const getRelationSelect: Function = (): Select<TBaseModel> => {
        const relationSelect: Select<TBaseModel> = {};

        for (const field of props.fields || []) {
            const key: string | null = field.field
                ? (Object.keys(field.field)[0] as string)
                : null;

            if (key && new props.modelType()?.isFileColumn(key)) {
                (relationSelect as JSONObject)[key] = {
                    file: true,
                    _id: true,
                    type: true,
                    name: true,
                };
            } else if (key && new props.modelType()?.isEntityColumn(key)) {
                (relationSelect as JSONObject)[key] = (field.field as any)[key];
            }
        }

        return relationSelect;
    };

    const setDetailFields: Function = (): void => {
        // set fields.

        const userPermissions: Array<Permission> =
            PermissionUtil.getAllPermissions();

        const model: BaseModel = new props.modelType();

        const accessControl: Dictionary<ColumnAccessControl> =
            model.getColumnAccessControlForAllColumns() || {};

        const fieldsToSet: Array<DetailField> = [];

        for (const field of props.fields) {
            const keys: Array<string> = Object.keys(
                field.field ? field.field : {}
            );

            if (keys.length > 0) {
                const key: string = keys[0] as string;

                let fieldPermissions: Array<Permission> = [];

                fieldPermissions = accessControl[key]?.read || [];

                const hasPermissions: boolean =
                    fieldPermissions &&
                    PermissionHelper.doesPermissionsIntersect(
                        userPermissions,
                        fieldPermissions
                    );

                if (hasPermissions || User.isMasterAdmin()) {
                    fieldsToSet.push({
                        ...field,
                        key: key,
                        getElement: field.getElement
                            ? (item: JSONObject): ReactElement => {
                                  return field.getElement!(
                                      item,
                                      onBeforeFetchData,
                                      fetchItem
                                  );
                              }
                            : undefined,
                    });
                }
            } else {
                fieldsToSet.push({
                    ...field,
                    key: '',
                    getElement: field.getElement
                        ? (item: JSONObject): ReactElement => {
                              return field.getElement!(
                                  item,
                                  onBeforeFetchData,
                                  fetchItem
                              );
                          }
                        : undefined,
                });
            }
        }

        setFields(fieldsToSet);
    };

    useEffect(() => {
        if (props.modelType) {
            setDetailFields();
        }
    }, [onBeforeFetchData, props.modelType]);

    const fetchItem: () => Promise<void> = async (): Promise<void> => {
        // get item.
        setIsLoading(true);
        props.onLoadingChange && props.onLoadingChange(true);
        setError('');
        try {
            if (props.onBeforeFetch) {
                const jobject: JSONObject = await props.onBeforeFetch();
                setOnBeforeFetchData(jobject);
            }

            const item: TBaseModel | null = await ModelAPI.getItem({
                modelType: props.modelType,
                id: props.modelId,
                select: {
                    ...getSelectFields(),
                    ...getRelationSelect(),
                },
            });

            if (!item) {
                setError(
                    `Cannot load ${(
                        new props.modelType()?.singularName || 'item'
                    ).toLowerCase()}. It could be because you don't have enough permissions to read this ${(
                        new props.modelType()?.singularName || 'item'
                    ).toLowerCase()}.`
                );
            }

            if (props.onItemLoaded && item) {
                props.onItemLoaded(item);
            }

            setItem(item);
        } catch (err) {
            setError(API.getFriendlyMessage(err));
            props.onError && props.onError(API.getFriendlyMessage(err));
        }
        setIsLoading(false);
        props.onLoadingChange && props.onLoadingChange(false);
    };

    useAsyncEffect(async () => {
        if (props.modelId && props.modelType) {
            await fetchItem();
        }
    }, [props.modelId, props.refresher, props.modelType]);

    if (isLoading) {
        return (
            <div
                className="row text-center flex justify-center"
                style={{
                    marginTop: '50px',
                    marginBottom: '50px',
                }}
            >
                <Loader
                    loaderType={LoaderType.Bar}
                    color={VeryLightGrey}
                    size={200}
                />
            </div>
        );
    }

    if (error) {
        return (
            <p
                className="text-center color-light-grey"
                style={{
                    marginTop: '50px',
                    marginBottom: '50px',
                }}
            >
                {error} <br />{' '}
                <span
                    onClick={async () => {
                        await fetchItem();
                    }}
                    className="underline primary-on-hover"
                >
                    Refresh?
                </span>
            </p>
        );
    }

    if (!item) {
        return <ErrorMessage error="Item not found" />;
    }

    return (
        <Detail
            id={props.id}
            item={BaseModel.toJSONObject(item, props.modelType)}
            fields={fields}
            showDetailsInNumberOfColumns={props.showDetailsInNumberOfColumns}
        />
    );
};

export default ModelDetail;
