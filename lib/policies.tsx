"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookText } from "lucide-react";
import { PoliciesModal } from "@/components/modals/policies-modal";

export const IsPolicies = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)} title="Chính sách học & thi">
        <BookText className="w-4 h-4" />
      </Button>
      <PoliciesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
