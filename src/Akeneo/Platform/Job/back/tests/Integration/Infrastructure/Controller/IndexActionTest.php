<?php

declare(strict_types=1);

namespace Akeneo\Platform\Job\Test\Integration\Infrastructure\Controller;

use Akeneo\Platform\Job\Test\Integration\ControllerIntegrationTestCase;
use PHPUnit\Framework\Assert;
use Symfony\Component\HttpFoundation\Response;

class IndexActionTest extends ControllerIntegrationTestCase
{
    private const ROUTE = 'akeneo_job_index_action';

    public function setUp(): void
    {
        parent::setUp();

        $this->fixturesLoader->loadFixtures();
    }

    public function test_it_returns_job_matches_count(): void
    {
        $this->logAs('peter');
        $this->webClientHelper->callApiRoute($this->client, self::ROUTE, [], 'POST');

        $response = $this->client->getResponse();
        Assert::assertSame($response->getStatusCode(), Response::HTTP_OK);
        Assert::assertSame(json_decode($response->getContent(), true)['matches_count'], 2);
    }

    public function test_without_permission_it_returns_only_jobs_for_current_user(): void
    {
        $this->logAs('mary');
        $this->webClientHelper->callApiRoute($this->client, self::ROUTE, [], 'POST');

        $response = $this->client->getResponse();
        Assert::assertSame($response->getStatusCode(), Response::HTTP_OK);
        Assert::assertSame(json_decode($response->getContent(), true)['matches_count'], 1);
    }

    public function test_it_returns_a_forbidden_access_when_user_cannot_access_to_process_tracker(): void
    {
        $this->logAs('betty');

        $this->webClientHelper->callApiRoute($this->client, self::ROUTE, [], 'POST');

        $response = $this->client->getResponse();
        Assert::assertSame($response->getStatusCode(), Response::HTTP_FORBIDDEN);
    }
}
