<?php

namespace App\Filament\Pages;

use App\Models\Lead;
use App\Models\LeadStatus;
use Filament\Pages\Page;
use Illuminate\Support\Collection;
use Mokhosh\FilamentKanban\Pages\KanbanBoard;

class LeadsPipeline extends KanbanBoard
{
    protected static ?string $navigationIcon = 'heroicon-o-view-columns';

    protected static ?string $navigationLabel = 'Sales Pipeline';

    protected static ?int $navigationSort = 2;

    protected static string $model = Lead::class;

    protected static string $recordTitleAttribute = 'name';

    protected static string $recordStatusAttribute = 'status_id';

    public function getTitle(): string
    {
        return 'Sales Pipeline';
    }

    public function getHeading(): string
    {
        return 'Sales Pipeline';
    }

    protected function statuses(): Collection
    {
        return LeadStatus::where('is_active', true)
            ->orderBy('order')
            ->get()
            ->map(fn (LeadStatus $status) => [
                'id' => $status->id,
                'title' => $status->name,
                'color' => $status->color,
            ]);
    }

    protected function records(): Collection
    {
        return Lead::with(['status', 'assignedTo'])
            ->whereHas('status', fn ($query) => $query->where('is_active', true))
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function onStatusChanged(string|int $recordId, string $status, array $fromOrderedIds, array $toOrderedIds): void
    {
        $lead = Lead::find($recordId);
        $lead->update(['status_id' => $status]);

        // Create activity log
        \App\Models\Activity::create([
            'lead_id' => $lead->id,
            'user_id' => auth()->id(),
            'type' => 'status_change',
            'description' => "Status changed to {$lead->status->name}",
            'activity_date' => now(),
        ]);
    }

    protected function getEditModalFormSchema(string|int|null $recordId): array
    {
        return [
            \Filament\Forms\Components\TextInput::make('name')
                ->required(),
            \Filament\Forms\Components\TextInput::make('phone')
                ->required(),
            \Filament\Forms\Components\TextInput::make('email')
                ->email(),
            \Filament\Forms\Components\TextInput::make('company'),
            \Filament\Forms\Components\Select::make('assigned_to')
                ->label('Assign To')
                ->relationship('assignedTo', 'name')
                ->searchable()
                ->preload(),
            \Filament\Forms\Components\TextInput::make('estimated_value')
                ->numeric()
                ->prefix('฿'),
        ];
    }
}
