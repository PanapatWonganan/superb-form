<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
use App\Models\Lead;
use App\Models\LeadStatus;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $leads = Lead::with(['status', 'assignedTo'])
            ->latest()
            ->paginate(20);

        return response()->json($leads);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeadRequest $request): JsonResponse
    {
        try {
            // Get the "New" status as default
            $newStatus = LeadStatus::where('name', 'New')->first();

            $lead = Lead::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'company' => $request->company,
                'position' => $request->position,
                'source' => $request->source ?? 'website_form',
                'status_id' => $newStatus?->id,
                'estimated_value' => $request->estimated_value,
                'form_data' => $request->form_data,
            ]);

            // Create activity log
            Activity::create([
                'lead_id' => $lead->id,
                'type' => 'lead_created',
                'description' => 'Lead created from ' . ($request->source ?? 'website form'),
                'activity_date' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Lead created successfully',
                'data' => $lead->load(['status', 'assignedTo']),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create lead',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $lead = Lead::with(['status', 'assignedTo', 'activities', 'tasks', 'notes'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $lead,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeadRequest $request, string $id): JsonResponse
    {
        try {
            $lead = Lead::findOrFail($id);

            // Only update fields that are present in the request
            $lead->update($request->validated());

            // Log activity if status changed
            if ($request->filled('status_id') && $lead->wasChanged('status_id')) {
                Activity::create([
                    'lead_id' => $lead->id,
                    'type' => 'status_change',
                    'description' => 'Status changed to ' . $lead->status->name,
                    'activity_date' => now(),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lead updated successfully',
                'data' => $lead->load(['status', 'assignedTo']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update lead',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $lead = Lead::findOrFail($id);
            $lead->delete(); // Soft delete

            return response()->json([
                'success' => true,
                'message' => 'Lead deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete lead',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
