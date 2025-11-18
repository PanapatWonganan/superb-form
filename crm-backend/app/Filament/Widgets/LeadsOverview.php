<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use App\Models\LeadStatus;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class LeadsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $totalLeads = Lead::count();
        $newLeads = Lead::whereHas('status', fn($q) => $q->where('name', 'New'))->count();
        $qualifiedLeads = Lead::whereHas('status', fn($q) => $q->where('name', 'Qualified'))->count();
        $wonLeads = Lead::whereHas('status', fn($q) => $q->where('name', 'Won'))->count();
        $lostLeads = Lead::whereHas('status', fn($q) => $q->where('name', 'Lost'))->count();

        // Calculate total estimated value
        $totalValue = Lead::sum('estimated_value');
        $wonValue = Lead::whereHas('status', fn($q) => $q->where('name', 'Won'))->sum('estimated_value');

        return [
            Stat::make('Total Leads', $totalLeads)
                ->description('All leads in system')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('primary')
                ->chart([7, 12, 8, 15, 9, 18, $totalLeads]),

            Stat::make('New Leads', $newLeads)
                ->description('Leads to be contacted')
                ->descriptionIcon('heroicon-m-sparkles')
                ->color('info')
                ->chart([3, 5, 4, 7, 6, 9, $newLeads]),

            Stat::make('Qualified Leads', $qualifiedLeads)
                ->description('Hot prospects')
                ->descriptionIcon('heroicon-m-fire')
                ->color('success')
                ->chart([2, 3, 2, 4, 3, 5, $qualifiedLeads]),

            Stat::make('Won Deals', $wonLeads)
                ->description('Successfully closed')
                ->descriptionIcon('heroicon-m-trophy')
                ->color('success'),

            Stat::make('Total Value', '฿' . number_format($totalValue, 2))
                ->description('Estimated pipeline value')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->color('warning'),

            Stat::make('Won Value', '฿' . number_format($wonValue, 2))
                ->description('Closed deal value')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
        ];
    }
}
