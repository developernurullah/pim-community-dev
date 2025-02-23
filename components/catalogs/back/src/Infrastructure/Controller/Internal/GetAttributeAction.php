<?php

declare(strict_types=1);

namespace Akeneo\Catalogs\Infrastructure\Controller\Internal;

use Akeneo\Catalogs\Application\Persistence\Attribute\FindOneAttributeByCodeQueryInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @copyright 2022 Akeneo SAS (http://www.akeneo.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
class GetAttributeAction
{
    public function __construct(
        private FindOneAttributeByCodeQueryInterface $findOneAttributeByCode,
    ) {
    }

    public function __invoke(Request $request, string $code): Response
    {
        if (!$request->isXmlHttpRequest()) {
            return new RedirectResponse('/');
        }

        $attribute = $this->findOneAttributeByCode->execute($code);

        if (null === $attribute) {
            throw new NotFoundHttpException(\sprintf('$attribute "%s" does not exist.', $code));
        }

        return new JsonResponse($attribute);
    }
}
