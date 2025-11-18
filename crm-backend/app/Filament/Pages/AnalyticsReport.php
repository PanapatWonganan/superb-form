<?php

namespace App\Filament\Pages;

use App\Models\Lead;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Section;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Pages\Page;
use Illuminate\Support\Facades\DB;

class AnalyticsReport extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';

    protected static ?string $navigationLabel = 'Analytics Reports';

    protected static ?int $navigationSort = 10;

    protected static string $view = 'filament.pages.analytics-report';

    public ?string $startDate = null;
    public ?string $endDate = null;

    public function mount(): void
    {
        // Default to last 30 days
        $this->startDate = now()->subDays(30)->format('Y-m-d');
        $this->endDate = now()->format('Y-m-d');
        $this->form->fill([
            'start_date' => $this->startDate,
            'end_date' => $this->endDate,
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Date Range Filter')
                    ->schema([
                        DatePicker::make('start_date')
                            ->label('Start Date')
                            ->default(now()->subDays(30))
                            ->required()
                            ->reactive()
                            ->afterStateUpdated(fn ($state) => $this->startDate = $state),

                        DatePicker::make('end_date')
                            ->label('End Date')
                            ->default(now())
                            ->required()
                            ->reactive()
                            ->afterStateUpdated(fn ($state) => $this->endDate = $state),
                    ])
                    ->columns(2),
            ])
            ->statePath('data');
    }

    public function getReportData(): array
    {
        $query = Lead::query();

        if ($this->startDate && $this->endDate) {
            $query->whereBetween('leads.created_at', [
                $this->startDate . ' 00:00:00',
                $this->endDate . ' 23:59:59'
            ]);
        }

        // Total leads
        $totalLeads = (clone $query)->count();

        // Leads by status
        $leadsByStatus = (clone $query)
            ->join('lead_statuses', 'leads.status_id', '=', 'lead_statuses.id')
            ->select('lead_statuses.name', DB::raw('COUNT(leads.id) as count'))
            ->groupBy('lead_statuses.id', 'lead_statuses.name')
            ->get();

        // Leads by source
        $leadsBySource = (clone $query)
            ->select('source', DB::raw('COUNT(*) as count'))
            ->groupBy('source')
            ->orderBy('count', 'desc')
            ->get();

        // Sales performance
        $salesPerformance = (clone $query)
            ->join('lead_statuses', 'leads.status_id', '=', 'lead_statuses.id')
            ->join('users', 'leads.assigned_to', '=', 'users.id')
            ->where('lead_statuses.name', 'Won')
            ->select(
                'users.name',
                DB::raw('COUNT(leads.id) as total_won'),
                DB::raw('SUM(COALESCE(leads.estimated_value, 0)) as total_value')
            )
            ->groupBy('users.id', 'users.name')
            ->orderBy('total_won', 'desc')
            ->get();

        // Conversion metrics
        $wonLeads = (clone $query)->whereHas('status', fn($q) => $q->where('name', 'Won'))->count();
        $lostLeads = (clone $query)->whereHas('status', fn($q) => $q->where('name', 'Lost'))->count();
        $conversionRate = $totalLeads > 0 ? round(($wonLeads / $totalLeads) * 100, 1) : 0;

        // Total revenue
        $totalRevenue = (clone $query)
            ->whereHas('status', fn($q) => $q->where('name', 'Won'))
            ->sum('estimated_value');

        return [
            'total_leads' => $totalLeads,
            'leads_by_status' => $leadsByStatus,
            'leads_by_source' => $leadsBySource,
            'sales_performance' => $salesPerformance,
            'won_leads' => $wonLeads,
            'lost_leads' => $lostLeads,
            'conversion_rate' => $conversionRate,
            'total_revenue' => $totalRevenue,
        ];
    }
}
