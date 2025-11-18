<x-filament-panels::page>
    <div class="space-y-6">
        {{-- Date Range Filter Form --}}
        <x-filament::section>
            <x-slot name="heading">
                Date Range Filter
            </x-slot>

            <form wire:submit.prevent="$refresh">
                {{ $this->form }}
            </form>
        </x-filament::section>

        @php
            $data = $this->getReportData();
        @endphp

        {{-- Key Metrics Cards --}}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {{-- Total Leads --}}
            <x-filament::section class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div class="text-center">
                    <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {{ number_format($data['total_leads']) }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Total Leads
                    </div>
                </div>
            </x-filament::section>

            {{-- Won Leads --}}
            <x-filament::section class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <div class="text-center">
                    <div class="text-3xl font-bold text-green-600 dark:text-green-400">
                        {{ number_format($data['won_leads']) }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Won Deals
                    </div>
                </div>
            </x-filament::section>

            {{-- Conversion Rate --}}
            <x-filament::section class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <div class="text-center">
                    <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {{ $data['conversion_rate'] }}%
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Conversion Rate
                    </div>
                </div>
            </x-filament::section>

            {{-- Total Revenue --}}
            <x-filament::section class="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                <div class="text-center">
                    <div class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                        ฿{{ number_format($data['total_revenue'], 2) }}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Total Revenue
                    </div>
                </div>
            </x-filament::section>
        </div>

        {{-- Leads by Status --}}
        <x-filament::section>
            <x-slot name="heading">
                Leads by Status
            </x-slot>

            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="border-b dark:border-gray-700">
                            <th class="px-4 py-3 text-sm font-semibold">Status</th>
                            <th class="px-4 py-3 text-sm font-semibold text-right">Count</th>
                            <th class="px-4 py-3 text-sm font-semibold text-right">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($data['leads_by_status'] as $status)
                            <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td class="px-4 py-3">{{ $status->name }}</td>
                                <td class="px-4 py-3 text-right font-medium">{{ number_format($status->count) }}</td>
                                <td class="px-4 py-3 text-right">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                        {{ $data['total_leads'] > 0 ? round(($status->count / $data['total_leads']) * 100, 1) : 0 }}%
                                    </span>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="3" class="px-4 py-8 text-center text-gray-500">
                                    No data available for this date range
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </x-filament::section>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {{-- Leads by Source --}}
            <x-filament::section>
                <x-slot name="heading">
                    Leads by Source
                </x-slot>

                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b dark:border-gray-700">
                                <th class="px-4 py-3 text-sm font-semibold">Source</th>
                                <th class="px-4 py-3 text-sm font-semibold text-right">Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($data['leads_by_source'] as $source)
                                <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td class="px-4 py-3 capitalize">{{ str_replace('_', ' ', $source->source) }}</td>
                                    <td class="px-4 py-3 text-right font-medium">{{ number_format($source->count) }}</td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="2" class="px-4 py-8 text-center text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </x-filament::section>

            {{-- Sales Performance --}}
            <x-filament::section>
                <x-slot name="heading">
                    Sales Performance
                </x-slot>

                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b dark:border-gray-700">
                                <th class="px-4 py-3 text-sm font-semibold">Sales Rep</th>
                                <th class="px-4 py-3 text-sm font-semibold text-right">Won Deals</th>
                                <th class="px-4 py-3 text-sm font-semibold text-right">Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($data['sales_performance'] as $performance)
                                <tr class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td class="px-4 py-3">{{ $performance->name }}</td>
                                    <td class="px-4 py-3 text-right">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                            {{ number_format($performance->total_won) }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-right font-medium">
                                        ฿{{ number_format($performance->total_value, 2) }}
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="3" class="px-4 py-8 text-center text-gray-500">
                                        No sales data available
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </x-filament::section>
        </div>

        {{-- Summary Stats --}}
        <x-filament::section>
            <x-slot name="heading">
                Period Summary
            </x-slot>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="text-lg font-semibold text-green-600 dark:text-green-400">
                        {{ number_format($data['won_leads']) }} Won
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Successful Deals
                    </div>
                </div>

                <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="text-lg font-semibold text-red-600 dark:text-red-400">
                        {{ number_format($data['lost_leads']) }} Lost
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Unsuccessful Deals
                    </div>
                </div>

                <div class="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {{ $data['total_leads'] - $data['won_leads'] - $data['lost_leads'] }} In Progress
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Active Leads
                    </div>
                </div>
            </div>
        </x-filament::section>
    </div>
</x-filament-panels::page>
