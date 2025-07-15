"use client";

import { useState } from "react";
import { Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportModal } from "@/components/modals/ReportModal";

export const IsReport = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)} title="Góp ý & Báo lỗi">
        <Bug className="w-4 h-4" />
      </Button>
      <ReportModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
