import React, {FC, useCallback, useState} from 'react';
import styled from 'styled-components';
import {getColor, SectionTitle, SwitcherButton, Table} from 'akeneo-design-system';
import {useTranslate} from '@akeneo-pim-community/shared';
import {TargetPlaceholder} from './components/TargetPlaceholder';
import {ProductMapping as ProductMappingType} from './models/ProductMapping';
import {ProductMappingSchema} from './models/ProductMappingSchema';
import {TargetSourceAssociation} from './components/TargetSourceAssociation';
import {ProductMappingErrors} from './models/ProductMappingErrors';
import {SourcePanel} from './components/SourcePanel';
import {Source} from './models/Source';

const MappingContainer = styled.div`
    display: flex;
    gap: 40px;
    padding-top: 10px;
`;
const TargetContainer = styled.div`
    flex-basis: 50%;
    flex-grow: 1;
`;
const SourceContainer = styled.div`
    flex-basis: 50%;
`;
const TargetCell = styled(Table.Cell)`
    width: 215px;
    color: ${getColor('brand', 100)};
    font-style: italic;
`;

type Props = {
    productMapping: ProductMappingType;
    productMappingSchema: ProductMappingSchema | undefined;
    errors: ProductMappingErrors;
    onChange: (values: ProductMappingType) => void;
};

export const ProductMapping: FC<Props> = ({productMapping, productMappingSchema, errors, onChange}) => {
    const translate = useTranslate();

    const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
    const [selectedTargetLabel, setSelectedTargetLabel] = useState<string | null>(null);
    const [selectedSource, setSelectedSource] = useState<Source | null>(null);

    const handleClick = useCallback(
        (targetCode, source) => {
            setSelectedTarget(targetCode);
            setSelectedTargetLabel(productMappingSchema?.properties[targetCode]?.title ?? targetCode);
            setSelectedSource(source);
        },
        [productMappingSchema]
    );

    const handleSourceUpdate = useCallback(
        (source: Source) => {
            if (selectedTarget !== null) {
                onChange({
                    ...productMapping,
                    [selectedTarget]: source,
                });
                setSelectedSource(source);
            }
        },
        [selectedTarget, onChange, productMapping]
    );

    const targets = Object.entries(productMapping ?? {});

    const targetsWithErrors = Object.keys(
        Object.fromEntries(
            Object.entries(errors).filter(([, value]) => {
                const properties = Object.entries(value ?? {});
                const propertiesWithErrors = properties.filter(([, value]) => typeof value === 'string');

                return propertiesWithErrors.length > 0;
            })
        )
    );

    return (
        <MappingContainer data-testid={'product-mapping'}>
            <TargetContainer>
                <SectionTitle>
                    <SectionTitle.Title>{translate('akeneo_catalogs.product_mapping.target.title')}</SectionTitle.Title>
                    <SectionTitle.Spacer />
                    <SwitcherButton label={translate('akeneo_catalogs.product_mapping.target.filter.label')}>
                        {translate('akeneo_catalogs.product_mapping.target.filter.option.all')}
                    </SwitcherButton>
                </SectionTitle>
                <Table>
                    <Table.Header>
                        <Table.HeaderCell>
                            {translate('akeneo_catalogs.product_mapping.target.table.target')}
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            {translate('akeneo_catalogs.product_mapping.target.table.source')}
                        </Table.HeaderCell>
                    </Table.Header>
                    <Table.Body>
                        {(targets.length === 0 || undefined === productMappingSchema) && <TargetPlaceholder />}
                        {targets.length > 0 && undefined !== productMappingSchema && (
                            <>
                                <Table.Row>
                                    <TargetCell>UUID</TargetCell>
                                    <Table.Cell>UUID</Table.Cell>
                                </Table.Row>
                                {targets.map(([targetCode, source]) => {
                                    if ('uuid' === targetCode) {
                                        return;
                                    }

                                    return (
                                        <TargetSourceAssociation
                                            isSelected={selectedTarget === targetCode}
                                            key={targetCode}
                                            onClick={handleClick}
                                            targetCode={targetCode}
                                            targetLabel={productMappingSchema.properties[targetCode]?.title}
                                            source={source}
                                            hasError={targetsWithErrors.includes(targetCode)}
                                        />
                                    );
                                })}
                            </>
                        )}
                    </Table.Body>
                </Table>
            </TargetContainer>
            <SourceContainer>
                <SourcePanel
                    target={selectedTarget}
                    targetLabel={selectedTargetLabel}
                    source={selectedSource}
                    onChange={handleSourceUpdate}
                    errors={selectedTarget === null ? null : errors[selectedTarget]}
                ></SourcePanel>
            </SourceContainer>
        </MappingContainer>
    );
};
