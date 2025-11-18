<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LeadResource\Pages;
use App\Filament\Resources\LeadResource\RelationManagers;
use App\Models\Lead;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class LeadResource extends Resource
{
    protected static ?string $model = Lead::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $navigationLabel = 'Leads';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Contact Information')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->placeholder('John Doe'),
                        Forms\Components\TextInput::make('email')
                            ->email()
                            ->maxLength(255)
                            ->placeholder('john@example.com'),
                        Forms\Components\TextInput::make('phone')
                            ->tel()
                            ->required()
                            ->maxLength(20)
                            ->placeholder('+66 12 345 6789'),
                        Forms\Components\TextInput::make('company')
                            ->maxLength(255)
                            ->placeholder('Company Name'),
                        Forms\Components\TextInput::make('position')
                            ->maxLength(255)
                            ->placeholder('Manager, CEO, etc.'),
                    ])->columns(2),

                Forms\Components\Section::make('Lead Details')
                    ->schema([
                        Forms\Components\Select::make('status_id')
                            ->relationship('status', 'name')
                            ->required()
                            ->default(function () {
                                return \App\Models\LeadStatus::where('name', 'New')->first()?->id;
                            })
                            ->preload(),
                        Forms\Components\Select::make('assigned_to')
                            ->relationship('assignedTo', 'name')
                            ->searchable()
                            ->preload()
                            ->placeholder('Select user'),
                        Forms\Components\TextInput::make('source')
                            ->required()
                            ->default('website_form')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('estimated_value')
                            ->numeric()
                            ->prefix('฿')
                            ->placeholder('0.00'),
                    ])->columns(2),

                Forms\Components\Section::make('Additional Data')
                    ->schema([
                        Forms\Components\KeyValue::make('form_data')
                            ->label('Form Data')
                            ->keyLabel('Field Name')
                            ->valueLabel('Value'),
                    ])->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->icon('heroicon-m-envelope')
                    ->copyable(),
                Tables\Columns\TextColumn::make('phone')
                    ->searchable()
                    ->icon('heroicon-m-phone')
                    ->copyable(),
                Tables\Columns\TextColumn::make('company')
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('status.name')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'New' => 'info',
                        'Contacted' => 'warning',
                        'Qualified' => 'success',
                        'Negotiation' => 'primary',
                        'Won' => 'success',
                        'Lost' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('assignedTo.name')
                    ->label('Assigned To')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('estimated_value')
                    ->money('THB')
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('source')
                    ->badge()
                    ->searchable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M d, Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->relationship('status', 'name'),
                Tables\Filters\SelectFilter::make('assigned_to')
                    ->relationship('assignedTo', 'name')
                    ->label('Assigned To'),
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from'),
                        Forms\Components\DatePicker::make('created_until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('export')
                        ->label('Export Selected')
                        ->icon('heroicon-o-arrow-down-tray')
                        ->color('success')
                        ->action(function ($records) {
                            $recordIds = $records->pluck('id')->toArray();
                            return \Maatwebsite\Excel\Facades\Excel::download(
                                new \App\Exports\LeadsExport($recordIds),
                                'leads_selected_' . now()->format('Y-m-d_His') . '.xlsx'
                            );
                        })
                        ->deselectRecordsAfterCompletion(),

                    Tables\Actions\BulkAction::make('assignTo')
                        ->label('Assign To User')
                        ->icon('heroicon-o-user')
                        ->form([
                            Forms\Components\Select::make('assigned_to')
                                ->label('Assign To')
                                ->options(\App\Models\User::where('is_active', true)->pluck('name', 'id'))
                                ->required()
                                ->searchable(),
                        ])
                        ->action(function ($records, array $data) {
                            $records->each(fn ($record) => $record->update(['assigned_to' => $data['assigned_to']]));
                        })
                        ->deselectRecordsAfterCompletion(),

                    Tables\Actions\BulkAction::make('changeStatus')
                        ->label('Change Status')
                        ->icon('heroicon-o-arrow-path')
                        ->form([
                            Forms\Components\Select::make('status_id')
                                ->label('New Status')
                                ->options(\App\Models\LeadStatus::where('is_active', true)->pluck('name', 'id'))
                                ->required()
                                ->searchable(),
                        ])
                        ->action(function ($records, array $data) {
                            $records->each(fn ($record) => $record->update(['status_id' => $data['status_id']]));
                        })
                        ->deselectRecordsAfterCompletion(),

                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\ActivitiesRelationManager::class,
            RelationManagers\TasksRelationManager::class,
            RelationManagers\NotesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLeads::route('/'),
            'create' => Pages\CreateLead::route('/create'),
            'edit' => Pages\EditLead::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
