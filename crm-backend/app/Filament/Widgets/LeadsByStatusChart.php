<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use App\Models\LeadStatus;
use Filament\Widgets\ChartWidget;

class LeadsByStatusChart extends ChartWidget
{
    protected static ?string $heading = 'Leads by Status';

    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $statuses = LeadStatus::withCount('leads')
            ->orderBy('order')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Leads',
                    'data' => $statuses->pluck('leads_count')->toArray(),
                    'backgroundColor' => $statuses->pluck('color')->toArray(),
                ],
            ],
            'labels' => $statuses->pluck('name')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
