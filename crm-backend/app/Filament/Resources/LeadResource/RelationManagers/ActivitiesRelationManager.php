<?php

namespace App\Filament\Resources\LeadResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ActivitiesRelationManager extends RelationManager
{
    protected static string $relationship = 'activities';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('type')
                    ->required()
                    ->options([
                        'call' => 'Phone Call',
                        'email' => 'Email',
                        'meeting' => 'Meeting',
                        'note' => 'Note',
                        'status_change' => 'Status Change',
                    ])
                    ->default('note')
                    ->native(false),
                Forms\Components\Select::make('user_id')
                    ->label('Created By')
                    ->relationship('user', 'name')
                    ->default(auth()->id())
                    ->required()
                    ->searchable()
                    ->preload(),
                Forms\Components\Textarea::make('description')
                    ->required()
                    ->rows(3)
                    ->placeholder('Describe the activity...'),
                Forms\Components\DateTimePicker::make('activity_date')
                    ->required()
                    ->default(now())
                    ->native(false),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('type')
            ->columns([
                Tables\Columns\TextColumn::make('type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'call' => 'success',
                        'email' => 'info',
                        'meeting' => 'warning',
                        'note' => 'gray',
                        'status_change' => 'primary',
                        default => 'gray',
                    })
                    ->icon(fn (string $state): string => match ($state) {
                        'call' => 'heroicon-m-phone',
                        'email' => 'heroicon-m-envelope',
                        'meeting' => 'heroicon-m-user-group',
                        'note' => 'heroicon-m-pencil',
                        'status_change' => 'heroicon-m-arrow-path',
                        default => 'heroicon-m-document',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('description')
                    ->limit(50)
                    ->wrap()
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('By')
                    ->sortable(),
                Tables\Columns\TextColumn::make('activity_date')
                    ->label('Date')
                    ->dateTime('M d, Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'call' => 'Phone Call',
                        'email' => 'Email',
                        'meeting' => 'Meeting',
                        'note' => 'Note',
                        'status_change' => 'Status Change',
                    ]),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('activity_date', 'desc');
    }
}
