<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class ConversionRateStats extends BaseWidget
{
    protected static ?int $sort = 2;

    protected function getStats(): array
    {
        // Get total leads
        $totalLeads = Lead::count();

        // Get won leads
        $wonLeads = Lead::whereHas('status', function ($query) {
            $query->where('name', 'Won');
        })->count();

        // Get lost leads
        $lostLeads = Lead::whereHas('status', function ($query) {
            $query->where('name', 'Lost');
        })->count();

        // Calculate conversion rate
        $conversionRate = $totalLeads > 0 ? round(($wonLeads / $totalLeads) * 100, 1) : 0;

        // Get previous month data for trend
        $prevMonthTotal = Lead::whereMonth('created_at', '=', now()->subMonth()->month)->count();
        $prevMonthWon = Lead::whereHas('status', function ($query) {
            $query->where('name', 'Won');
        })->whereMonth('created_at', '=', now()->subMonth()->month)->count();

        $prevConversionRate = $prevMonthTotal > 0 ? round(($prevMonthWon / $prevMonthTotal) * 100, 1) : 0;
        $trend = $conversionRate - $prevConversionRate;

        return [
            Stat::make('Conversion Rate', $conversionRate . '%')
                ->description($trend > 0 ? "+{$trend}% from last month" : "{$trend}% from last month")
                ->descriptionIcon($trend > 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($trend > 0 ? 'success' : ($trend < 0 ? 'danger' : 'gray'))
                ->chart([30, 40, 35, 50, 49, 60, $conversionRate]),

            Stat::make('Won Deals', $wonLeads)
                ->description('Successfully closed')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Lost Deals', $lostLeads)
                ->description('Unsuccessful')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),

            Stat::make('Win Rate', $totalLeads > 0 ? round(($wonLeads / ($wonLeads + $lostLeads > 0 ? $wonLeads + $lostLeads : 1)) * 100, 1) . '%' : '0%')
                ->description('Of closed deals')
                ->color('info'),
        ];
    }
}
