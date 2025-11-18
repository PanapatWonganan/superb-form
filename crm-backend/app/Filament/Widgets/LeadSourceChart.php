<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class LeadSourceChart extends ChartWidget
{
    protected static ?string $heading = 'Lead Source Distribution';

    protected static ?int $sort = 4;

    protected function getData(): array
    {
        $sourceData = Lead::select('source', DB::raw('COUNT(*) as count'))
            ->groupBy('source')
            ->orderBy('count', 'desc')
            ->get();

        if ($sourceData->isEmpty()) {
            return [
                'datasets' => [
                    [
                        'label' => 'Leads by Source',
                        'data' => [0],
                        'backgroundColor' => ['#e5e7eb'],
                    ],
                ],
                'labels' => ['No data'],
            ];
        }

        $colors = [
            '#3b82f6', // blue
            '#10b981', // green
            '#f59e0b', // yellow
            '#ef4444', // red
            '#8b5cf6', // purple
            '#ec4899', // pink
        ];

        return [
            'datasets' => [
                [
                    'label' => 'Leads by Source',
                    'data' => $sourceData->pluck('count')->toArray(),
                    'backgroundColor' => array_slice($colors, 0, $sourceData->count()),
                ],
            ],
            'labels' => $sourceData->pluck('source')->map(function ($source) {
                return ucfirst(str_replace('_', ' ', $source));
            })->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
