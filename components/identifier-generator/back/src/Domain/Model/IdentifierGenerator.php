<?php

declare(strict_types=1);

namespace Akeneo\Pim\Automation\IdentifierGenerator\Domain\Model;

use Akeneo\Pim\Automation\IdentifierGenerator\Domain\Model\Condition\Conditions;

/**
 * @copyright 2022 Akeneo SAS (https://www.akeneo.com)
 * @license   https://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
final class IdentifierGenerator
{
    public function __construct(
        private IdentifierGeneratorId $id,
        private IdentifierGeneratorCode $code,
        private Conditions $conditions,
        private Structure $structure,
        private LabelCollection $labelCollection,
        private Target $target,
        private ?Delimiter $delimiter,
    ) {
    }

    public function id(): IdentifierGeneratorId
    {
        return $this->id;
    }

    public function code(): IdentifierGeneratorCode
    {
        return $this->code;
    }

    public function conditions(): Conditions
    {
        return $this->conditions;
    }

    public function structure(): Structure
    {
        return $this->structure;
    }

    public function labelCollection(): LabelCollection
    {
        return $this->labelCollection;
    }

    public function target(): Target
    {
        return $this->target;
    }

    public function delimiter(): ?Delimiter
    {
        return $this->delimiter;
    }

    public function setStructure(Structure $structure): void
    {
        $this->structure = $structure;
    }

    public function setLabelCollection(LabelCollection $labelCollection): void
    {
        $this->labelCollection = $labelCollection;
    }

    public function setTarget(Target $target): void
    {
        $this->target = $target;
    }

    public function setDelimiter(?Delimiter $delimiter): void
    {
        $this->delimiter = $delimiter;
    }

    /**
     * @return array{
     *     uuid: string,
     *     code: string,
     *     conditions: array<mixed>,
     *     structure: array<mixed>,
     *     labels: array<string, string>|\stdClass,
     *     target: string,
     *     delimiter: string | null,
     * }
     */
    public function normalize(): array
    {
        return [
            'uuid' => $this->id->asString(),
            'code' => $this->code->asString(),
            'conditions' => $this->conditions->normalize(),
            'structure' => $this->structure->normalize(),
            'labels' => $this->labelCollection->normalize(),
            'target' => $this->target->asString(),
            'delimiter' => $this->delimiter?->asString(),
        ];
    }

    public function match(ProductProjection $productProjection): bool
    {
        $identifierValue = $productProjection->identifier();

        return (null === $identifierValue || '' === $identifierValue);
    }
}
