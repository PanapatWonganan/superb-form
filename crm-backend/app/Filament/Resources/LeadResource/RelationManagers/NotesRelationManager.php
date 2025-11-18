<?php

namespace App\Filament\Resources\LeadResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class NotesRelationManager extends RelationManager
{
    protected static string $relationship = 'notes';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\RichEditor::make('content')
                    ->required()
                    ->placeholder('Write your note here...')
                    ->toolbarButtons([
                        'bold',
                        'italic',
                        'underline',
                        'bulletList',
                        'orderedList',
                        'link',
                    ])
                    ->columnSpanFull(),
                Forms\Components\Select::make('user_id')
                    ->label('Created By')
                    ->relationship('user', 'name')
                    ->default(auth()->id())
                    ->required()
                    ->searchable()
                    ->preload(),
                Forms\Components\Toggle::make('is_important')
                    ->label('Mark as Important')
                    ->default(false)
                    ->inline(false),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('content')
            ->columns([
                Tables\Columns\TextColumn::make('content')
                    ->label('Note')
                    ->html()
                    ->limit(100)
                    ->wrap()
                    ->searchable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('By')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_important')
                    ->label('Important')
                    ->boolean()
                    ->trueIcon('heroicon-o-star')
                    ->falseIcon('heroicon-o-star')
                    ->trueColor('warning')
                    ->falseColor('gray'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('M d, Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\TernaryFilter::make('is_important')
                    ->label('Important Notes')
                    ->placeholder('All notes')
                    ->trueLabel('Important only')
                    ->falseLabel('Regular only'),
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
            ->defaultSort('created_at', 'desc');
    }
}
