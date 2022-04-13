<?php

namespace Akeneo\Test\Channel\Integration\Query\Sql;

use Akeneo\Channel\API\Query\Channel;
use Akeneo\Channel\API\Query\FindChannels;
use Akeneo\Test\Integration\Configuration;
use Akeneo\Test\Integration\TestCase;

final class SqlFindChannelsIntegration extends TestCase
{
    private FindChannels $sqlGetChannels;

    public function setUp(): void
    {
        parent::setUp();

        $this->sqlGetChannels = $this->get(
            'SqlFindChannels'
        );
    }

    public function test_it_finds_all_channels(): void
    {
        $results = $this->sqlGetChannels->findAll();

        $this->assertIsArray($results);
        $this->assertCount(3, $results);
        $this->assertContainsOnlyInstancesOf(Channel::class, $results);

        $printChannel = current(array_filter($results, fn (Channel $channel) => $channel->getCode() === 'print'));

        $this->assertContains('de_DE', $printChannel->getLocaleCodes());
        $this->assertContains('en_US', $printChannel->getLocaleCodes());
        $this->assertContains('fr_FR', $printChannel->getLocaleCodes());

        $this->assertContains('USD', $printChannel->getActiveCurrencies());
        $this->assertContains('EUR', $printChannel->getActiveCurrencies());
    }

    protected function getConfiguration(): Configuration
    {
        return $this->catalog->useFunctionalCatalog('catalog_modeling');
    }
}
