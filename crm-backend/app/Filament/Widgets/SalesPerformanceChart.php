<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use App\Models\User;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class SalesPerformanceChart extends ChartWidget
{
    protected static ?string $heading = 'Sales Performance by User';

    protected static ?int $sort = 3;

    protected function getData(): array
    {
        // Get won leads count and value by user
        $salesData = Lead::join('lead_statuses', 'leads.status_id', '=', 'lead_statuses.id')
            ->join('users', 'leads.assigned_to', '=', 'users.id')
            ->where('lead_statuses.name', 'Won')
            ->select(
                'users.name',
                DB::raw('COUNT(leads.id) as total_won'),
                DB::raw('SUM(COALESCE(leads.estimated_value, 0)) as total_value')
            )
            ->groupBy('users.id', 'users.name')
            ->orderBy('total_won', 'desc')
            ->limit(10)
            ->get();

        if ($salesData->isEmpty()) {
            return [
                'datasets' => [
                    [
                        'label' => 'Deals Won',
                        'data' => [0],
                        'backgroundColor' => '#10b981',
                    ],
                ],
                'labels' => ['No data'],
            ];
        }

        return [
            'datasets' => [
                [
                    'label' => 'Deals Won',
                    'data' => $salesData->pluck('total_won')->toArray(),
                    'backgroundColor' => '#10b981',
                ],
            ],
            'labels' => $salesData->pluck('name')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'ticks' => [
                        'precision' => 0,
                    ],
                ],
            ],
        ];
    }
}
