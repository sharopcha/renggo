"use server";

import { unstable_noStore } from "next/cache";
import { getErrorMessage } from "@/lib/handle-error";

interface Task {
  id: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  label?: string;
}

export async function updateTasks(input: {
  ids: string[];
  label?: Task["label"];
  status?: Task["status"];
  priority?: Task["priority"];
}) {
  unstable_noStore();
  try {
    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteTasks(input: { ids: string[] }) {
  unstable_noStore();
  try {
    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
