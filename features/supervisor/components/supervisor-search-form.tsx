"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SupervisorStudentResultCard } from "@/features/supervisor/components/supervisor-student-result-card";
import {
  supervisorSearchSchema,
  type SupervisorSearchSchema,
} from "@/features/supervisor/schemas/supervisor-score-schema";
import { useSupervisorStudentQuery } from "@/features/supervisor/queries/supervisor-student-queries";

export function SupervisorSearchForm() {
  const [searchedMatricNumber, setSearchedMatricNumber] = useState("");

  const form = useForm<SupervisorSearchSchema>({
    resolver: zodResolver(supervisorSearchSchema),
    defaultValues: {
      matricNumber: "",
    },
  });

  const studentQuery = useSupervisorStudentQuery(searchedMatricNumber);

  const onSubmit = form.handleSubmit((values) => {
    setSearchedMatricNumber(values.matricNumber.trim());
  });

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <SurfaceCard className="space-y-5">
        <SectionHeading
          eyebrow="Lookup"
          title="Search by matric number"
          description="Retrieve the correct student before submitting a supervision score."
        />

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="matricNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matric number</FormLabel>
                  <FormControl>
                    <Input placeholder="CSC/2021/014" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto">
              <Search className="h-4 w-4" />
              Search student
            </Button>
          </form>
        </Form>
      </SurfaceCard>

      {studentQuery.isLoading ? (
        <SurfaceCard>
          <p className="text-sm text-muted">Searching student record...</p>
        </SurfaceCard>
      ) : (
        <SupervisorStudentResultCard
          student={studentQuery.data ?? null}
          searchedMatricNumber={searchedMatricNumber}
        />
      )}
    </div>
  );
}
