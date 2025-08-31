'use client';

import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Completed
        </Badge>
      );
    case "upcoming":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Upcoming
        </Badge>
      );
    case "active":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Active
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
