<?php

namespace App\Exports;

use App\Models\Lead;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LeadsExport implements FromQuery, WithHeadings, WithMapping, WithStyles
{
    protected $recordIds;

    /**
     * Constructor to optionally accept specific record IDs
     */
    public function __construct($recordIds = null)
    {
        $this->recordIds = $recordIds;
    }

    /**
     * Query for leads with relationships
     */
    public function query()
    {
        $query = Lead::query()
            ->with(['status', 'assignedTo'])
            ->orderBy('created_at', 'desc');

        // If specific record IDs are provided, filter by them
        if ($this->recordIds) {
            $query->whereIn('id', $this->recordIds);
        }

        return $query;
    }

    /**
     * Define column headings
     */
    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Email',
            'Phone',
            'Company',
            'Position',
            'Source',
            'Status',
            'Assigned To',
            'Estimated Value (฿)',
            'Created At',
            'Updated At',
        ];
    }

    /**
     * Map data for each row
     */
    public function map($lead): array
    {
        return [
            $lead->id,
            $lead->name,
            $lead->email,
            $lead->phone,
            $lead->company,
            $lead->position,
            $lead->source,
            $lead->status?->name ?? '-',
            $lead->assignedTo?->name ?? 'Unassigned',
            $lead->estimated_value ? number_format($lead->estimated_value, 2) : '-',
            $lead->created_at?->format('Y-m-d H:i:s'),
            $lead->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Apply styles to the worksheet
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold
            1 => ['font' => ['bold' => true]],
        ];
    }
}
