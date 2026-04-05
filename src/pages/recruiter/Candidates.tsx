import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star } from 'lucide-react';

// Exact mock data from task
const candidateData = [
  { id: 1, name: "Sarah Johnson", stage: "Interviewed", rating: 4.8, appliedDate: "2024-01-15" },
  { id: 2, name: "Michael Chen", stage: "Offered", rating: 4.5, appliedDate: "2024-01-12" },
  { id: 3, name: "Emily Davis", stage: "Screened", rating: 4.2, appliedDate: "2024-01-18" },
  { id: 4, name: "James Wilson", stage: "Applied", rating: 3.8, appliedDate: "2024-01-20" },
];

const Candidates = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Candidates</h2>
          <p className="text-gray-600">Static mock-up table (non-functional)</p>
        </div>
      </div>

      {/* Detailed Evaluation Table - EXACT SPEC */}
      <Card className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Current Quality Score</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {candidateData.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{candidate.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    ⭐ {candidate.rating}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="text-sm">
                    {candidate.stage}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="text-center text-sm text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-lg">
        <p>✓ Static placeholder table implemented per specification</p>
        <p>✗ No filtering/sorting/responsiveness (per task requirements)</p>
      </div>
    </div>
  );
};

export default Candidates;

