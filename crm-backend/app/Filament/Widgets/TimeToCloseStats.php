<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class TimeToCloseStats extends BaseWidget
{
    protected static ?int $sort = 5;

    protected function getStats(): array
    {
        // Get won leads with time to close
        $wonLeads = Lead::whereHas('status', function ($query) {
            $query->where('name', 'Won');
        })
            ->select('id', 'created_at', 'updated_at')
            ->get();

        $avgDays = 0;
        $fastestDays = null;
        $slowestDays = null;

        if ($wonLeads->isNotEmpty()) {
            $daysDiff = $wonLeads->map(function ($lead) {
                return $lead->created_at->diffInDays($lead->updated_at);
            });

            $avgDays = round($daysDiff->avg(), 1);
            $fastestDays = $daysDiff->min();
            $slowestDays = $daysDiff->max();
        }

        // Get this month vs last month
        $thisMonthWon = Lead::whereHas('status', function ($query) {
            $query->where('name', 'Won');
        })->whereMonth('updated_at', '=', now()->month)->count();

        $lastMonthWon = Lead::whereHas('status', function ($query) {
            $query->where('name', 'Won');
        })->whereMonth('updated_at', '=', now()->subMonth()->month)->count();

        $trend = $thisMonthWon - $lastMonthWon;

        return [
            Stat::make('Avg. Time to Close', $avgDays . ' days')
                ->description('Average conversion time')
                ->descriptionIcon('heroicon-m-clock')
                ->color('info'),

            Stat::make('Fastest Close', $fastestDays !== null ? $fastestDays . ' days' : 'N/A')
                ->description('Best performance')
                ->descriptionIcon('heroicon-m-bolt')
                ->color('success'),

            Stat::make('Slowest Close', $slowestDays !== null ? $slowestDays . ' days' : 'N/A')
                ->description('Needs improvement')
                ->descriptionIcon('heroicon-m-arrow-trending-down')
                ->color('warning'),

            Stat::make('Closed This Month', $thisMonthWon)
                ->description($trend > 0 ? "+{$trend} from last month" : "{$trend} from last month")
                ->descriptionIcon($trend > 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($trend > 0 ? 'success' : 'gray'),
        ];
    }
}
