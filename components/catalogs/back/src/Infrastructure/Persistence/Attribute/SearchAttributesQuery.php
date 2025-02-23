<?php

declare(strict_types=1);

namespace Akeneo\Catalogs\Infrastructure\Persistence\Attribute;

use Akeneo\Catalogs\Application\Persistence\Attribute\SearchAttributesQueryInterface;
use Akeneo\Pim\Structure\Component\Model\AttributeInterface;
use Akeneo\Tool\Component\StorageUtils\Repository\SearchableRepositoryInterface;

/**
 * @copyright 2022 Akeneo SAS (http://www.akeneo.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
final class SearchAttributesQuery implements SearchAttributesQueryInterface
{
    public function __construct(
        private SearchableRepositoryInterface $searchableAttributeRepository,
    ) {
    }

    /**
     * @param array<string> $types
     * @return array<array{code: string, label: string, type: string, scopable: bool, localizable: bool, measurement_family?: string, default_measurement_unit?: string}>
     */
    public function execute(?string $search = null, int $page = 1, int $limit = 20, array $types = []): array
    {
        $types = \array_map(fn ($type) => \sprintf('pim_catalog_%s', $type), $types);

        $attributes = $this->searchableAttributeRepository->findBySearch(
            $search,
            [
                'limit' => $limit,
                'page' => $page,
                'types' => empty($types) ? null : $types,
            ],
        );

        return \array_map(
            static function (AttributeInterface $attribute): array {
                $normalizedAttribute = [
                    'code' => $attribute->getCode(),
                    'label' => $attribute->getLabel(),
                    'type' => $attribute->getType(),
                    'scopable' => $attribute->isScopable(),
                    'localizable' => $attribute->isLocalizable(),
                ];

                if ('pim_catalog_metric' === $attribute->getType()) {
                    $normalizedAttribute['measurement_family'] = $attribute->getMetricFamily();
                    $normalizedAttribute['default_measurement_unit'] = $attribute->getDefaultMetricUnit();
                }

                return $normalizedAttribute;
            },
            $attributes
        );
    }
}
