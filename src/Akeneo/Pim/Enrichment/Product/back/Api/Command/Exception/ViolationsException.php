<?php

declare(strict_types=1);

namespace Akeneo\Pim\Enrichment\Product\Api\Command\Exception;

use Symfony\Component\Validator\ConstraintViolationList;

/**
 * @copyright 2022 Akeneo SAS (https://www.akeneo.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
final class ViolationsException extends \LogicException
{
    public function __construct(private ConstraintViolationList $constraintViolationList)
    {
        parent::__construct((string) $this->constraintViolationList);
    }

    public function violations(): ConstraintViolationList
    {
        return $this->constraintViolationList;
    }
}
